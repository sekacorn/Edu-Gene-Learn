package com.edugene.integrator.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing genomic data uploaded by users.
 * Supports VCF, JSON, and CSV formats from services like 23andMe and AncestryDNA.
 */
@Entity
@Table(name = "genomic_data")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenomicData {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull(message = "User ID is required")
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @NotBlank(message = "File name is required")
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotBlank(message = "File type is required")
    @Column(name = "file_type", nullable = false, length = 50)
    private String fileType; // VCF, JSON, CSV

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "file_path")
    private String filePath;

    @CreatedDate
    @Column(name = "upload_date", nullable = false, updatable = false)
    private Instant uploadDate;

    @Column(name = "processing_status", length = 50)
    @Builder.Default
    private String processingStatus = "pending"; // pending, processing, completed, failed

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    /**
     * Check if the file is a VCF format.
     */
    public boolean isVcfFile() {
        return "VCF".equalsIgnoreCase(fileType) ||
               (fileName != null && fileName.toLowerCase().endsWith(".vcf"));
    }

    /**
     * Check if the file is a CSV format.
     */
    public boolean isCsvFile() {
        return "CSV".equalsIgnoreCase(fileType) ||
               (fileName != null && fileName.toLowerCase().endsWith(".csv"));
    }

    /**
     * Check if the file is a JSON format.
     */
    public boolean isJsonFile() {
        return "JSON".equalsIgnoreCase(fileType) ||
               (fileName != null && fileName.toLowerCase().endsWith(".json"));
    }

    /**
     * Mark the genomic data processing as completed.
     */
    public void markCompleted() {
        this.processingStatus = "completed";
        this.errorMessage = null;
    }

    /**
     * Mark the genomic data processing as failed with an error message.
     */
    public void markFailed(String error) {
        this.processingStatus = "failed";
        this.errorMessage = error;
    }

    /**
     * Mark the genomic data processing as in progress.
     */
    public void markProcessing() {
        this.processingStatus = "processing";
        this.errorMessage = null;
    }
}
