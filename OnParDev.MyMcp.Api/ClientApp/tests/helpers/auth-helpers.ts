import { Page } from '@playwright/test'
import { ConfigurationResponse } from '@/api'
import { unauthenticatedConfig, authenticatedConfig } from './config-helpers'

// Test environment flag for detecting E2E test mode
const TEST_ENV_FLAG = '__PLAYWRIGHT_TEST_MODE__'

/**
 * Sets up the configuration endpoint to return specific config for testing
 */
export async function mockConfigEndpoint(page: Page, config: ConfigurationResponse) {
  // Mock the config endpoint with proper handling for both main requests and CORS
  await page.route('**/api/v1/config*', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      // Handle CORS preflight requests
      await route.fulfill({
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    } else {
      // Handle actual config requests
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(config),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }
  })
}

/**
 * Mocks the servers API endpoints to return empty data for testing
 */
async function mockServersEndpoints(page: Page) {
  // Mock GET /api/v1/mcp-servers (getUserMcpServers)
  await page.route('**/api/v1/mcp-servers*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]), // Empty array of servers
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    } else if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    } else {
      // For other methods (POST, etc.), just return success
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
  })
}

/**
 * Sets up unauthenticated mode (development mode without Clerk)
 */
export async function setupUnauthenticatedMode(page: Page) {
  await mockConfigEndpoint(page, unauthenticatedConfig)
  await mockServersEndpoints(page)
  await setTestEnvironmentFlag(page)
}

/**
 * Sets up authenticated mode with Clerk mocking
 */
export async function setupAuthenticatedMode(page: Page, options: {
  isSignedIn: boolean
  userId?: string
  userEmail?: string
} = { isSignedIn: false }) {
  // Mock the configuration endpoint
  await mockConfigEndpoint(page, authenticatedConfig)
  
  // Mock the servers API
  await mockServersEndpoints(page)
  
  // Set test environment flag
  await setTestEnvironmentFlag(page)
  
  // Mock Clerk components and state
  await mockClerkComponents(page, options.isSignedIn)

  // Set up authentication state
  if (options.isSignedIn) {
    await mockClerkSignedInState(page, {
      userId: options.userId || 'user_test123',
      userEmail: options.userEmail || 'test@example.com',
    })
  } else {
    await mockClerkSignedOutState(page)
  }
}

/**
 * Sets a test environment flag that components can check
 */
async function setTestEnvironmentFlag(page: Page) {
  await page.addInitScript((flag) => {
    window[flag] = true
  }, TEST_ENV_FLAG)
}

/**
 * Mocks Clerk components to show/hide based on authentication state
 */
async function mockClerkComponents(page: Page, isSignedIn: boolean) {
  await page.addInitScript((signedIn, _testFlag) => {
    // Create mock Clerk context
    window.__CLERK_TEST_STATE = {
      isSignedIn: signedIn,
      isLoaded: true,
      user: signedIn ? {
        id: 'user_test123',
        primaryEmailAddress: { emailAddress: 'test@example.com' }
      } : null
    }
    
    // Override Clerk components behavior in test environment
    window.__CLERK_MOCK_MODE = true
    
    // Force immediate state synchronization for components
    window.__CLERK_STATE_READY = true
  }, isSignedIn, TEST_ENV_FLAG)
}

/**
 * Mocks Clerk signed-in state by intercepting Clerk API calls
 */
async function mockClerkSignedInState(page: Page, user: { userId: string; userEmail: string }) {
  // Mock all Clerk API endpoints that components might call
  await page.route('**/clerk/**', async (route) => {
    const url = route.request().url()
    
    if (url.includes('/client') || url.includes('/environment')) {
      // Mock client/environment endpoint
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          object: 'client',
          id: 'client_test123',
          sessions: [{
            object: 'session',
            id: 'sess_test123',
            status: 'active',
            user: {
              id: user.userId,
              primaryEmailAddress: {
                emailAddress: user.userEmail,
              },
            },
          }],
          activeSessions: ['sess_test123'],
        }),
      })
    } else if (url.includes('/sessions')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          object: 'session',
          id: 'sess_test123',
          status: 'active',
          user: {
            id: user.userId,
            primaryEmailAddress: {
              emailAddress: user.userEmail,
            },
          },
        }),
      })
    } else if (url.includes('/users')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          object: 'user',
          id: user.userId,
          primaryEmailAddress: {
            emailAddress: user.userEmail,
          },
        }),
      })
    } else {
      // For any other Clerk endpoint, return success
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }
  })

  // Set comprehensive Clerk state in browser storage
  await page.addInitScript((userData) => {
    // Mock Clerk's internal state
    window.localStorage.setItem('__clerk_session_id', 'sess_test123')
    window.localStorage.setItem('__clerk_user_id', userData.userId)
    window.localStorage.setItem('__clerk_session', JSON.stringify({
      id: 'sess_test123',
      status: 'active',
      user: userData,
    }))
    
    // Mock Clerk's global state
    window.__clerk_state = {
      isSignedIn: true,
      isLoaded: true,
      user: userData,
      session: {
        id: 'sess_test123',
        status: 'active',
      }
    }
  }, user)
}

/**
 * Mocks Clerk signed-out state
 */
async function mockClerkSignedOutState(page: Page) {
  // Mock Clerk API calls to return signed-out state
  await page.route('**/clerk/**', async (route) => {
    const url = route.request().url()
    
    if (url.includes('/client') || url.includes('/environment')) {
      // Mock client/environment endpoint for signed-out state
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          object: 'client',
          id: 'client_test123',
          sessions: [],
          activeSessions: [],
        }),
      })
    } else {
      // For other endpoints, return signed-out state
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthenticated' }),
      })
    }
  })

  // Clear any Clerk session data and set signed-out state
  await page.addInitScript(() => {
    window.localStorage.removeItem('__clerk_session')
    window.localStorage.removeItem('__clerk_session_id')
    window.localStorage.removeItem('__clerk_user_id')
    window.sessionStorage.clear()
    
    // Mock Clerk's global state for signed-out
    window.__clerk_state = {
      isSignedIn: false,
      isLoaded: true,
      user: null,
      session: null
    }
  })
}

// Note: signInDuringTest and signOutDuringTest functions removed
// These were used for dynamic authentication state changes during tests
// which proved unreliable. Static authentication testing is preferred.