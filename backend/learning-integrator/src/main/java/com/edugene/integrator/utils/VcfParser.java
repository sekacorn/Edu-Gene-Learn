package com.edugene.integrator.utils;

import com.edugene.integrator.model.GenomicData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * Utility class for parsing VCF (Variant Call Format) files.
 * Processes genomic variant data from services like 23andMe and AncestryDNA.
 */
@Component
@Slf4j
public class VcfParser {

    /**
     * Parse VCF file and extract genomic variants.
     *
     * @param genomicData Genomic data entity containing file path
     */
    public void parseVcfFile(GenomicData genomicData) {
        log.info("Parsing VCF file: {}", genomicData.getFilePath());

        try (BufferedReader reader = new BufferedReader(new FileReader(genomicData.getFilePath()))) {
            String line;
            int variantCount = 0;

            while ((line = reader.readLine()) != null) {
                // Skip header lines (start with ##)
                if (line.startsWith("##")) {
                    continue;
                }

                // Process column header line (starts with #CHROM)
                if (line.startsWith("#CHROM")) {
                    log.debug("Found VCF header: {}", line);
                    continue;
                }

                // Process variant lines
                String[] fields = line.split("\t");
                if (fields.length >= 5) {
                    parseVariantLine(fields, genomicData);
                    variantCount++;

                    if (variantCount % 1000 == 0) {
                        log.debug("Processed {} variants", variantCount);
                    }
                }
            }

            log.info("VCF parsing complete. Total variants processed: {}", variantCount);

        } catch (IOException e) {
            log.error("Error parsing VCF file: {}", genomicData.getFilePath(), e);
            throw new RuntimeException("Failed to parse VCF file", e);
        }
    }

    /**
     * Parse individual variant line from VCF file.
     *
     * VCF format:
     * CHROM  POS     ID      REF  ALT  QUAL  FILTER  INFO  FORMAT  SAMPLE
     *
     * @param fields Variant line fields
     * @param genomicData Genomic data entity
     */
    private void parseVariantLine(String[] fields, GenomicData genomicData) {
        try {
            String chromosome = fields[0];
            long position = Long.parseLong(fields[1]);
            String rsId = fields[2]; // dbSNP ID
            String referenceAllele = fields[3];
            String alternateAllele = fields[4];
            String qualityScore = fields.length > 5 ? fields[5] : null;
            String filter = fields.length > 6 ? fields[6] : null;
            String info = fields.length > 7 ? fields[7] : null;

            // Here you would typically save this to a GenomicVariant entity
            // For now, we're just parsing and validating the structure
            log.trace("Parsed variant: chr={}, pos={}, rsId={}, ref={}, alt={}",
                    chromosome, position, rsId, referenceAllele, alternateAllele);

            // Extract gene information from INFO field if available
            String geneName = extractGeneFromInfo(info);

            // TODO: Save parsed variant to database (GenomicVariant entity)
            // This would involve creating a GenomicVariant object and saving it via repository

        } catch (NumberFormatException e) {
            log.warn("Invalid position in variant line: {}", fields[1]);
        } catch (Exception e) {
            log.error("Error parsing variant line", e);
        }
    }

    /**
     * Extract gene name from VCF INFO field.
     *
     * @param info INFO field from VCF line
     * @return Gene name if found, null otherwise
     */
    private String extractGeneFromInfo(String info) {
        if (info == null || info.isEmpty()) {
            return null;
        }

        // Look for GENE= tag in INFO field
        String[] infoParts = info.split(";");
        for (String part : infoParts) {
            if (part.startsWith("GENE=")) {
                return part.substring(5);
            }
            if (part.startsWith("GENEINFO=")) {
                // Extract gene name from GENEINFO field
                String geneInfo = part.substring(9);
                int colonIndex = geneInfo.indexOf(':');
                if (colonIndex > 0) {
                    return geneInfo.substring(0, colonIndex);
                }
                return geneInfo;
            }
        }

        return null;
    }

    /**
     * Validate VCF file format.
     *
     * @param filePath Path to VCF file
     * @return true if valid VCF format, false otherwise
     */
    public boolean isValidVcfFile(String filePath) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String firstLine = reader.readLine();

            // VCF files should start with ##fileformat=VCF
            if (firstLine != null && firstLine.startsWith("##fileformat=VCF")) {
                return true;
            }

            log.warn("Invalid VCF file format. Expected ##fileformat=VCF, got: {}", firstLine);
            return false;

        } catch (IOException e) {
            log.error("Error validating VCF file: {}", filePath, e);
            return false;
        }
    }
}
