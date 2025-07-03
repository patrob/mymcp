import { Page } from '@playwright/test'
import { ConfigurationResponse } from '@/api'
import { unauthenticatedConfig, authenticatedConfig } from './config-helpers'

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
 * Sets up unauthenticated mode (development mode without Clerk)
 */
export async function setupUnauthenticatedMode(page: Page) {
  await mockConfigEndpoint(page, unauthenticatedConfig)
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

  // Simplified approach: just mock the authentication state and let the real components handle rendering
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

/**
 * Simulates signing in during a test
 */
export async function signInDuringTest(page: Page, user: {
  userId?: string
  userEmail?: string
} = {}) {
  const userData = {
    userId: user.userId || 'user_test123',
    userEmail: user.userEmail || 'test@example.com',
  }
  
  // Update the global mock state
  await page.evaluate((newUser) => {
    window.__CLERK_MOCK_STATE = 'signed-in'
    window.__CLERK_MOCK_USER = newUser
  }, userData)
  
  await mockClerkSignedInState(page, userData)
  
  // Reload page to pick up new auth state
  await page.reload()
}

/**
 * Simulates signing out during a test
 */
export async function signOutDuringTest(page: Page) {
  // Update the global mock state
  await page.evaluate(() => {
    window.__CLERK_MOCK_STATE = 'signed-out'
    window.__CLERK_MOCK_USER = null
  })
  
  await mockClerkSignedOutState(page)
  
  // Reload page to pick up new auth state
  await page.reload()
}