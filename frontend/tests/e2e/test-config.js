/**
 * E2E Test Configuration
 *
 * Configure whether tests run against real backend or mock mode
 */

export const TEST_MODE = process.env.E2E_TEST_MODE || 'mock'; // 'mock' or 'real'

export const config = {
  // Mock mode: Tests run without requiring backend services
  mock: {
    enabled: TEST_MODE === 'mock',
    delay: 500, // Simulated network delay in ms
  },

  // Real mode: Tests run against actual backend services
  real: {
    enabled: TEST_MODE === 'real',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    apiURL: process.env.API_URL || 'http://localhost:8080',
  },

  // Default test user
  testUser: {
    username: 'admin',
    password: 'Admin123!',
    email: 'admin@edugenelearn.com',
  },
};

/**
 * Mock API responses for testing without backend
 */
export const mockResponses = {
  login: {
    success: {
      token: 'mock-jwt-token',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'admin',
        email: 'admin@edugenelearn.com',
        role: 'ADMIN',
        mbtiType: 'INTJ',
      },
    },
    failure: {
      error: 'Invalid credentials',
    },
  },

  uploadGenomicData: {
    success: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      fileName: 'test_data.vcf',
      fileType: 'VCF',
      processingStatus: 'pending',
      message: 'File uploaded successfully',
    },
  },

  learningRecommendations: {
    success: {
      recommendedVisualEmphasis: 75.5,
      recommendedAuditoryEmphasis: 60.2,
      recommendedKinestheticEmphasis: 55.8,
      optimalSessionDurationMinutes: 90,
      preferredStudyTime: 'morning',
      strategies: [
        'Use visual aids: diagrams, charts, and color-coded notes',
        'Your genetic profile suggests strong memory - use spaced repetition techniques',
        'Leverage online learning platforms and interactive tools',
      ],
      confidenceScore: 0.89,
    },
  },

  llmQuery: {
    success: {
      response: 'To import your genomic data (VCF file from 23andMe or AncestryDNA), go to the Data Upload page and select your VCF file. The system supports VCF, CSV, and JSON formats.',
      modelUsed: 'huggingface',
      cached: false,
      mbtiTailored: true,
    },
  },

  collaborationSession: {
    success: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      sessionName: 'Test Study Group',
      sessionType: 'study_group',
      maxParticipants: 5,
      isActive: true,
      ownerId: '123e4567-e89b-12d3-a456-426614174000',
    },
  },
};

/**
 * Helper function to wait for mock API response
 */
export async function mockApiDelay() {
  if (config.mock.enabled) {
    await new Promise(resolve => setTimeout(resolve, config.mock.delay));
  }
}

export default config;
