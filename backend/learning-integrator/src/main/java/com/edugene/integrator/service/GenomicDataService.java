package com.edugene.integrator.service;

import com.edugene.integrator.model.GenomicData;
import com.edugene.integrator.repository.GenomicDataRepository;
import com.edugene.integrator.utils.VcfParser;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing genomic data uploads and processing.
 * Handles VCF, CSV, and JSON file formats from genomic testing services.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GenomicDataService {

    private final GenomicDataRepository genomicDataRepository;
    private final VcfParser vcfParser;

    /**
     * Upload and save genomic data file.
     */
    @Transactional
    @CacheEvict(value = "genomicData", key = "#userId")
    public GenomicData uploadGenomicData(UUID userId, MultipartFile file) throws IOException {
        log.info("Uploading genomic data for user: {}, filename: {}", userId, file.getOriginalFilename());

        // Validate file
        validateFile(file);

        // Save file to storage
        String filePath = saveFile(file);

        // Create genomic data entity
        GenomicData genomicData = GenomicData.builder()
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .fileType(getFileType(file.getOriginalFilename()))
                .fileSizeBytes(file.getSize())
                .filePath(filePath)
                .processingStatus("pending")
                .build();

        GenomicData saved = genomicDataRepository.save(genomicData);
        log.info("Genomic data uploaded successfully with ID: {}", saved.getId());

        return saved;
    }

    /**
     * Process genomic data file.
     */
    @Transactional
    @CircuitBreaker(name = "dataProcessing", fallbackMethod = "processFallback")
    @Retry(name = "dataProcessing")
    public void processGenomicData(UUID genomicDataId) {
        log.info("Processing genomic data with ID: {}", genomicDataId);

        GenomicData genomicData = genomicDataRepository.findById(genomicDataId)
                .orElseThrow(() -> new IllegalArgumentException("Genomic data not found: " + genomicDataId));

        genomicData.markProcessing();
        genomicDataRepository.save(genomicData);

        try {
            if (genomicData.isVcfFile()) {
                vcfParser.parseVcfFile(genomicData);
            } else if (genomicData.isCsvFile()) {
                // Parse CSV file (implementation in VcfParser or separate CsvParser)
                log.info("CSV parsing for genomic data: {}", genomicDataId);
            } else if (genomicData.isJsonFile()) {
                // Parse JSON file
                log.info("JSON parsing for genomic data: {}", genomicDataId);
            }

            genomicData.markCompleted();
            genomicDataRepository.save(genomicData);
            log.info("Genomic data processed successfully: {}", genomicDataId);

        } catch (Exception e) {
            log.error("Error processing genomic data: {}", genomicDataId, e);
            genomicData.markFailed(e.getMessage());
            genomicDataRepository.save(genomicData);
            throw new RuntimeException("Failed to process genomic data", e);
        }
    }

    /**
     * Fallback method for processing failures.
     */
    @SuppressWarnings("unused")
    private void processFallback(UUID genomicDataId, Exception e) {
        log.error("Circuit breaker activated for genomic data processing: {}", genomicDataId, e);
        GenomicData genomicData = genomicDataRepository.findById(genomicDataId)
                .orElse(null);
        if (genomicData != null) {
            genomicData.markFailed("Service temporarily unavailable. Please try again later.");
            genomicDataRepository.save(genomicData);
        }
    }

    /**
     * Get all genomic data for a user.
     */
    @Cacheable(value = "genomicData", key = "#userId")
    public List<GenomicData> getUserGenomicData(UUID userId) {
        log.debug("Fetching genomic data for user: {}", userId);
        return genomicDataRepository.findByUserId(userId);
    }

    /**
     * Get genomic data by ID.
     */
    public GenomicData getGenomicDataById(UUID id) {
        return genomicDataRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genomic data not found: " + id));
    }

    /**
     * Delete genomic data.
     */
    @Transactional
    @CacheEvict(value = "genomicData", key = "#genomicData.userId")
    public void deleteGenomicData(GenomicData genomicData) {
        log.info("Deleting genomic data: {}", genomicData.getId());

        // Delete file from storage
        try {
            Path filePath = Paths.get(genomicData.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Error deleting file: {}", genomicData.getFilePath(), e);
        }

        genomicDataRepository.delete(genomicData);
    }

    /**
     * Validate uploaded file.
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Filename is null");
        }

        String fileType = getFileType(filename);
        if (!List.of("VCF", "CSV", "JSON").contains(fileType.toUpperCase())) {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    /**
     * Get file type from filename.
     */
    private String getFileType(String filename) {
        if (filename == null) {
            return "UNKNOWN";
        }

        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "UNKNOWN";
        }

        return filename.substring(lastDotIndex + 1).toUpperCase();
    }

    /**
     * Save file to storage.
     */
    private String saveFile(MultipartFile file) throws IOException {
        // Create uploads directory if it doesn't exist
        String uploadDir = System.getProperty("user.dir") + "/uploads";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }
}
