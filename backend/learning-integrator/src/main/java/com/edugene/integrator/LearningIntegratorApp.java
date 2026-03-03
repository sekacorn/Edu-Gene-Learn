package com.edugene.integrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for Learning Integrator Service.
 *
 * This service integrates genomic data (VCF files from 23andMe, AncestryDNA),
 * educational data (CSV assessments), and environmental data (JSON/CSV surveys)
 * for the EduGeneLearn platform.
 *
 * @author sekacorn
 * @version 1.0.0
 */
@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
@EnableAsync
public class LearningIntegratorApp {

    public static void main(String[] args) {
        SpringApplication.run(LearningIntegratorApp.class, args);
    }
}
