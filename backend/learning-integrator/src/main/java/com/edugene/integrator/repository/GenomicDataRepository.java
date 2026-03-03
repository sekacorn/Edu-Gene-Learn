package com.edugene.integrator.repository;

import com.edugene.integrator.model.GenomicData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for GenomicData entity.
 * Provides CRUD operations and custom queries for genomic data management.
 */
@Repository
public interface GenomicDataRepository extends JpaRepository<GenomicData, UUID> {

    /**
     * Find all genomic data for a specific user.
     */
    List<GenomicData> findByUserId(UUID userId);

    /**
     * Find genomic data by user ID and processing status.
     */
    List<GenomicData> findByUserIdAndProcessingStatus(UUID userId, String status);

    /**
     * Find all genomic data with a specific processing status.
     */
    List<GenomicData> findByProcessingStatus(String status);

    /**
     * Count genomic data files by user ID.
     */
    long countByUserId(UUID userId);

    /**
     * Find pending genomic data for processing.
     */
    @Query("SELECT g FROM GenomicData g WHERE g.processingStatus = 'pending' ORDER BY g.createdAt ASC")
    List<GenomicData> findPendingData();

    /**
     * Find completed genomic data for a user.
     */
    @Query("SELECT g FROM GenomicData g WHERE g.userId = :userId AND g.processingStatus = 'completed'")
    List<GenomicData> findCompletedDataByUser(@Param("userId") UUID userId);
}
