import { ConfigurationResponse } from '@/api'

/**
 * Creates a mock configuration response for E2E tests
 */
export function createMockConfig(overrides: Partial<ConfigurationResponse> = {}): ConfigurationResponse {
  return {
    clerk: {
      publishableKey: '',
      authority: 'https://test-auth.example.com',
      afterSignOutUrl: '/',
      ...overrides.clerk,
    },
    api: {
      baseUrl: 'http://localhost:5099',
      version: 'v1',
      ...overrides.api,
    },
    features: {
      enableAuth: false,
      enableAnalytics: false,
      ...overrides.features,
    },
    ...overrides,
  }
}

/**
 * Configuration for testing unauthenticated flows (development mode)
 */
export const unauthenticatedConfig = createMockConfig({
  features: {
    enableAuth: false,
    enableAnalytics: false,
  },
  clerk: {
    publishableKey: '',
    authority: '',
    afterSignOutUrl: '/',
  },
})

/**
 * Configuration for testing authenticated flows
 */
export const authenticatedConfig = createMockConfig({
  features: {
    enableAuth: true,
    enableAnalytics: false,
  },
  clerk: {
    publishableKey: 'pk_test_mock_key_for_e2e_tests',
    authority: 'https://test-auth.example.com',
    afterSignOutUrl: '/',
  },
})