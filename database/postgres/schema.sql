-- EduGeneLearn PostgreSQL Database Schema
-- Version: 1.0
-- Description: Comprehensive schema for genomic, educational, and environmental data integration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- MBTI types enum
CREATE TYPE mbti_type AS ENUM (
    'ENTJ', 'INFP', 'INFJ', 'ESTP', 'INTJ', 'INTP',
    'ISTJ', 'ESFJ', 'ISFP', 'ENTP', 'ISFJ', 'ESFP',
    'ENFJ', 'ESTJ', 'ISTP', 'ENFP'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),  -- NULL for SSO users
    full_name VARCHAR(255),
    role user_role DEFAULT 'USER' NOT NULL,
    mbti_type mbti_type,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    sso_provider VARCHAR(50),  -- okta, auth0, azure-ad, google, NULL for local auth
    sso_subject VARCHAR(255),  -- SSO unique identifier
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),   -- TOTP secret for MFA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT sso_provider_check CHECK (
        (sso_provider IS NULL AND password_hash IS NOT NULL) OR
        (sso_provider IS NOT NULL AND sso_subject IS NOT NULL)
    )
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_sso_subject ON users(sso_subject);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(512) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- MFA backup codes table
CREATE TABLE mfa_backup_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_mfa_backup_codes_user_id ON mfa_backup_codes(user_id);

-- ============================================================================
-- GENOMIC DATA TABLES
-- ============================================================================

-- Genomic data files uploaded by users
CREATE TABLE genomic_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,  -- VCF, JSON, CSV
    file_size_bytes BIGINT,
    file_path TEXT,  -- Storage path or S3 key
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processing_status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, failed
    error_message TEXT,
    metadata JSONB,  -- Additional file metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_genomic_data_user_id ON genomic_data(user_id);
CREATE INDEX idx_genomic_data_status ON genomic_data(processing_status);

-- Parsed genomic variants (from VCF files)
CREATE TABLE genomic_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    genomic_data_id UUID NOT NULL REFERENCES genomic_data(id) ON DELETE CASCADE,
    chromosome VARCHAR(10) NOT NULL,
    position BIGINT NOT NULL,
    reference_allele VARCHAR(1000),
    alternate_allele VARCHAR(1000),
    quality_score NUMERIC,
    filter VARCHAR(50),
    gene_name VARCHAR(255),
    variant_type VARCHAR(50),  -- SNP, INDEL, etc.
    rs_id VARCHAR(50),  -- dbSNP reference ID
    clinical_significance VARCHAR(100),
    associated_traits JSONB,  -- Array of associated traits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_genomic_variants_data_id ON genomic_variants(genomic_data_id);
CREATE INDEX idx_genomic_variants_gene ON genomic_variants(gene_name);
CREATE INDEX idx_genomic_variants_rs_id ON genomic_variants(rs_id);

-- ============================================================================
-- EDUCATIONAL DATA TABLES
-- ============================================================================

-- Educational assessments
CREATE TABLE educational_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) NOT NULL,  -- learning_style, cognitive_profile, etc.
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scores JSONB NOT NULL,  -- Flexible structure for different assessment types
    file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_educational_assessments_user_id ON educational_assessments(user_id);
CREATE INDEX idx_educational_assessments_type ON educational_assessments(assessment_type);

-- Learning profiles derived from assessments and genomic data
CREATE TABLE learning_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visual_learning_score NUMERIC(5,2),
    auditory_learning_score NUMERIC(5,2),
    kinesthetic_learning_score NUMERIC(5,2),
    reading_writing_score NUMERIC(5,2),
    memory_strength NUMERIC(5,2),
    attention_span_score NUMERIC(5,2),
    processing_speed_score NUMERIC(5,2),
    preferred_study_time VARCHAR(50),  -- morning, afternoon, evening, night
    optimal_session_duration_minutes INTEGER,
    profile_data JSONB,  -- Additional profile attributes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_learning_profiles_user_id ON learning_profiles(user_id);

-- ============================================================================
-- ENVIRONMENTAL DATA TABLES
-- ============================================================================

-- Socio-economic and environmental factors
CREATE TABLE environmental_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    region VARCHAR(100),
    country_code VARCHAR(10),
    socioeconomic_status VARCHAR(50),
    access_to_technology VARCHAR(50),  -- high, medium, low
    primary_language VARCHAR(50),
    additional_languages JSONB,  -- Array of additional languages
    internet_quality VARCHAR(50),  -- excellent, good, fair, poor
    study_environment_quality VARCHAR(50),
    environmental_factors JSONB,  -- Additional environmental data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_environmental_data_user_id ON environmental_data(user_id);
CREATE INDEX idx_environmental_data_region ON environmental_data(region);

-- ============================================================================
-- AI PREDICTIONS AND RECOMMENDATIONS
-- ============================================================================

-- AI-generated learning recommendations
CREATE TABLE learning_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL,  -- study_strategy, resource_type, schedule, etc.
    recommendation_text TEXT NOT NULL,
    confidence_score NUMERIC(5,4),  -- 0.0 to 1.0
    supporting_factors JSONB,  -- Factors that influenced this recommendation
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_learning_recommendations_user_id ON learning_recommendations(user_id);
CREATE INDEX idx_learning_recommendations_type ON learning_recommendations(recommendation_type);

-- AI model predictions log
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    input_features JSONB NOT NULL,
    predictions JSONB NOT NULL,
    confidence_scores JSONB,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_predictions_user_id ON ai_predictions(user_id);
CREATE INDEX idx_ai_predictions_created_at ON ai_predictions(created_at);

-- ============================================================================
-- VISUALIZATION AND INTERACTION
-- ============================================================================

-- 3D Visualizations generated
CREATE TABLE visualizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visualization_type VARCHAR(100) NOT NULL,  -- genomic_structure, trait_heatmap, etc.
    title VARCHAR(255),
    description TEXT,
    data_source_ids JSONB,  -- References to genomic_data, assessments, etc.
    visualization_config JSONB,  -- Three.js configuration
    thumbnail_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visualizations_user_id ON visualizations(user_id);
CREATE INDEX idx_visualizations_type ON visualizations(visualization_type);

-- User annotations on visualizations
CREATE TABLE annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visualization_id UUID REFERENCES visualizations(id) ON DELETE CASCADE,
    annotation_text TEXT NOT NULL,
    position_data JSONB,  -- 3D coordinates or other positioning info
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_annotations_user_id ON annotations(user_id);
CREATE INDEX idx_annotations_visualization_id ON annotations(visualization_id);

-- ============================================================================
-- COLLABORATION TABLES
-- ============================================================================

-- Collaborative sessions
CREATE TABLE collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(50),  -- research, classroom, study_group
    is_active BOOLEAN DEFAULT TRUE,
    max_participants INTEGER DEFAULT 10,
    session_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_collaboration_sessions_owner_id ON collaboration_sessions(owner_id);
CREATE INDEX idx_collaboration_sessions_active ON collaboration_sessions(is_active);

-- Collaboration session participants
CREATE TABLE collaboration_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'participant',  -- owner, moderator, participant
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(session_id, user_id)
);

CREATE INDEX idx_collaboration_participants_session_id ON collaboration_participants(session_id);
CREATE INDEX idx_collaboration_participants_user_id ON collaboration_participants(user_id);

-- Collaboration actions/events
CREATE TABLE collaboration_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,  -- annotation_added, view_changed, chat_message, etc.
    action_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collaboration_actions_session_id ON collaboration_actions(session_id);
CREATE INDEX idx_collaboration_actions_created_at ON collaboration_actions(created_at);

-- ============================================================================
-- LLM SERVICE TABLES
-- ============================================================================

-- LLM queries and responses
CREATE TABLE llm_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    query_context JSONB,  -- User's MBTI type, current view, etc.
    response_text TEXT NOT NULL,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    response_time_ms INTEGER,
    user_feedback_rating INTEGER,  -- 1-5 rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_llm_queries_user_id ON llm_queries(user_id);
CREATE INDEX idx_llm_queries_created_at ON llm_queries(created_at);

-- Troubleshooting logs
CREATE TABLE troubleshooting_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_context JSONB,  -- Browser, OS, current action, etc.
    llm_analysis TEXT,  -- LLM-generated troubleshooting advice
    resolution_status VARCHAR(50) DEFAULT 'pending',  -- pending, resolved, escalated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_troubleshooting_logs_user_id ON troubleshooting_logs(user_id);
CREATE INDEX idx_troubleshooting_logs_status ON troubleshooting_logs(resolution_status);

-- ============================================================================
-- SYSTEM MONITORING TABLES
-- ============================================================================

-- Resource usage monitoring
CREATE TABLE resource_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    cpu_percent NUMERIC(5,2),
    memory_mb INTEGER,
    gpu_percent NUMERIC(5,2),
    active_connections INTEGER,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resource_usage_service ON resource_usage_logs(service_name);
CREATE INDEX idx_resource_usage_logged_at ON resource_usage_logs(logged_at);

-- API usage tracking for rate limiting
CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genomic_data_updated_at BEFORE UPDATE ON genomic_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_assessments_updated_at BEFORE UPDATE ON educational_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_profiles_updated_at BEFORE UPDATE ON learning_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environmental_data_updated_at BEFORE UPDATE ON environmental_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visualizations_updated_at BEFORE UPDATE ON visualizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_annotations_updated_at BEFORE UPDATE ON annotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Create default admin user (password: Admin123! - CHANGE IN PRODUCTION)
INSERT INTO users (username, email, password_hash, full_name, role, is_active, is_email_verified)
VALUES (
    'admin',
    'admin@edugenelearn.com',
    crypt('Admin123!', gen_salt('bf')),
    'System Administrator',
    'ADMIN',
    TRUE,
    TRUE
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO edugene;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO edugene;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with support for local auth and SSO (Okta, Auth0, Azure AD, Google)';
COMMENT ON TABLE genomic_data IS 'Uploaded genomic data files (VCF, JSON, CSV) from services like 23andMe';
COMMENT ON TABLE learning_recommendations IS 'AI-generated personalized learning recommendations';
COMMENT ON TABLE collaboration_sessions IS 'Real-time collaborative sessions for students, educators, and researchers';
