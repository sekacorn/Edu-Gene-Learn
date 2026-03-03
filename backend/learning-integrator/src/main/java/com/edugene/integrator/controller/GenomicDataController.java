package com.edugene.integrator.controller;

import com.edugene.integrator.model.GenomicData;
import com.edugene.integrator.service.GenomicDataService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for genomic data management.
 * Provides endpoints for uploading, processing, and retrieving genomic data.
 */
@RestController
@RequestMapping("/api/v1/genomic-data")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
public class GenomicDataController {

    private final GenomicDataService genomicDataService;

    /**
     * Upload genomic data file (VCF, CSV, or JSON).
     *
     * @param userId User ID
     * @param file Genomic data file
     * @return Uploaded genomic data entity
     */
    @PostMapping("/upload")
    @RateLimiter(name = "api")
    public ResponseEntity<GenomicData> uploadGenomicData(
            @RequestParam("userId") @NotNull UUID userId,
            @RequestParam("file") @NotNull MultipartFile file) {
        try {
            log.info("Received upload request from user: {} for file: {}", userId, file.getOriginalFilename());
            GenomicData genomicData = genomicDataService.uploadGenomicData(userId, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(genomicData);
        } catch (IllegalArgumentException e) {
            log.error("Invalid upload request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error uploading genomic data", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Trigger processing of genomic data.
     *
     * @param genomicDataId Genomic data ID
     * @return Processing status
     */
    @PostMapping("/{genomicDataId}/process")
    @RateLimiter(name = "api")
    public ResponseEntity<String> processGenomicData(@PathVariable UUID genomicDataId) {
        try {
            log.info("Processing genomic data: {}", genomicDataId);
            genomicDataService.processGenomicData(genomicDataId);
            return ResponseEntity.ok("Processing started");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error processing genomic data: {}", genomicDataId, e);
            return ResponseEntity.internalServerError().body("Processing failed");
        }
    }

    /**
     * Get all genomic data for a user.
     *
     * @param userId User ID
     * @return List of genomic data
     */
    @GetMapping("/user/{userId}")
    @RateLimiter(name = "api")
    public ResponseEntity<List<GenomicData>> getUserGenomicData(@PathVariable UUID userId) {
        try {
            List<GenomicData> genomicData = genomicDataService.getUserGenomicData(userId);
            return ResponseEntity.ok(genomicData);
        } catch (Exception e) {
            log.error("Error fetching genomic data for user: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get genomic data by ID.
     *
     * @param genomicDataId Genomic data ID
     * @return Genomic data entity
     */
    @GetMapping("/{genomicDataId}")
    @RateLimiter(name = "api")
    public ResponseEntity<GenomicData> getGenomicData(@PathVariable UUID genomicDataId) {
        try {
            GenomicData genomicData = genomicDataService.getGenomicDataById(genomicDataId);
            return ResponseEntity.ok(genomicData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error fetching genomic data: {}", genomicDataId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete genomic data.
     *
     * @param genomicDataId Genomic data ID
     * @return Deletion status
     */
    @DeleteMapping("/{genomicDataId}")
    @RateLimiter(name = "api")
    public ResponseEntity<String> deleteGenomicData(@PathVariable UUID genomicDataId) {
        try {
            GenomicData genomicData = genomicDataService.getGenomicDataById(genomicDataId);
            genomicDataService.deleteGenomicData(genomicData);
            return ResponseEntity.ok("Genomic data deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting genomic data: {}", genomicDataId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Learning Integrator Service is healthy");
    }
}
