package com.edugene.session;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Main application class for User Session Service.
 *
 * This service manages user authentication, authorization, SSO, MFA,
 * and session management for the EduGeneLearn platform.
 *
 * Supports:
 * - Local authentication with JWT
 * - SSO (Google, Okta, Azure AD, Auth0)
 * - Multi-Factor Authentication (TOTP)
 * - User roles: USER, MODERATOR, ADMIN
 *
 * @author sekacorn
 * @version 1.0.0
 */
@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
@EnableAsync
@EnableMethodSecurity
public class UserSessionApp {

    public static void main(String[] args) {
        SpringApplication.run(UserSessionApp.class, args);
    }
}
