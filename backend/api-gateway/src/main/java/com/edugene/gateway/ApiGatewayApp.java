package com.edugene.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for API Gateway.
 *
 * This gateway routes requests to all EduGeneLearn microservices,
 * providing centralized:
 * - Request routing
 * - Rate limiting
 * - Circuit breaking
 * - CORS handling
 * - Load balancing
 *
 * @author sekacorn
 * @version 1.0.0
 */
@SpringBootApplication
public class ApiGatewayApp {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApp.class, args);
    }
}
