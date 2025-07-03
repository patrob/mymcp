import { test, expect } from '@playwright/test'
import { 
  setupUnauthenticatedMode, 
  setupAuthenticatedMode,
  signInDuringTest,
  signOutDuringTest
} from '../helpers/auth-helpers'

test.describe('Authentication Flows', () => {
  test.describe('Development Mode (Auth Disabled)', () => {
    test('landing page shows direct dashboard link when auth is disabled', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/')
      
      // Assert - Should show direct dashboard link instead of sign-in
      // Use more specific selector that matches the actual implementation
      await expect(page.locator('a[href="/dashboard"]').first()).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible()
    })

    test('dashboard is directly accessible in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/dashboard')
      
      // Assert - Should show development banner and dashboard content
      await expect(page.getByText('Development Mode')).toBeVisible()
      await expect(page.getByText('Authentication is disabled')).toBeVisible()
      await expect(page.getByText('Server Instances')).toBeVisible()
    })
  })

  test.describe('Production Mode (Auth Enabled)', () => {
    test('landing page shows sign-in button when auth is enabled', async ({ page }) => {
      // Arrange - Setup authenticated mode but not signed in
      await setupAuthenticatedMode(page, { isSignedIn: false })
      
      // Act
      await page.goto('/')
      
      // Assert - Should show sign-in button instead of direct dashboard link
      // The sign-in button is rendered by Clerk's SignInButton component
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
      await expect(page.locator('a[href="/dashboard"]').first()).not.toBeVisible()
    })

    test('dashboard requires authentication when auth is enabled', async ({ page }) => {
      // Arrange - Setup authenticated mode but not signed in
      await setupAuthenticatedMode(page, { isSignedIn: false })
      
      // Act
      await page.goto('/dashboard')
      
      // Assert - Should show redirect to sign-in component or be redirected away
      // Check if redirect component is shown or if we're redirected away from dashboard
      const redirectComponent = page.getByTestId('redirect-to-signin')
      const isOnDashboard = page.url().includes('/dashboard')
      
      if (isOnDashboard) {
        await expect(redirectComponent).toBeVisible({ timeout: 5000 })
      } else {
        await expect(page.url()).not.toContain('/dashboard')
      }
    })

    test('signed-in users can access dashboard', async ({ page }) => {
      // Arrange - Setup authenticated mode with signed-in user
      await setupAuthenticatedMode(page, { 
        isSignedIn: true,
        userEmail: 'test@example.com' 
      })
      
      // Act
      await page.goto('/dashboard')
      
      // Assert - Should access dashboard without development banner
      await expect(page.getByText('Development Mode')).not.toBeVisible()
      await expect(page.getByText('Server Instances')).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
    })

    test('user navigation shows user menu when signed in', async ({ page }) => {
      // Arrange - Setup authenticated mode with signed-in user
      await setupAuthenticatedMode(page, { 
        isSignedIn: true,
        userEmail: 'test@example.com' 
      })
      
      // Act
      await page.goto('/')
      
      // Assert - Should show user menu and dashboard link
      await expect(page.locator('a[href="/dashboard"]').first()).toBeVisible()
      // UserButton might not have a specific test id, so check for presence of user-related element
      await expect(page.locator('.cl-userButton, [data-testid="user-button"]')).toBeVisible()
    })
  })

  test.describe('Authentication State Changes', () => {
    test('signing out redirects to landing page', async ({ page }) => {
      // Arrange - Start with signed-in user
      await setupAuthenticatedMode(page, { 
        isSignedIn: true,
        userEmail: 'test@example.com' 
      })
      await page.goto('/dashboard')
      
      // Act - Sign out
      await signOutDuringTest(page)
      
      // Assert - Should show redirect component or be redirected away
      const redirectComponent = page.getByTestId('redirect-to-signin')
      const isOnDashboard = page.url().includes('/dashboard')
      
      if (isOnDashboard) {
        await expect(redirectComponent).toBeVisible({ timeout: 5000 })
      } else {
        await expect(page.url()).not.toContain('/dashboard')
      }
    })

    test('signing in grants access to protected routes', async ({ page }) => {
      // Arrange - Start with auth enabled but not signed in
      await setupAuthenticatedMode(page, { isSignedIn: false })
      await page.goto('/')
      
      // Act - Sign in
      await signInDuringTest(page, { userEmail: 'test@example.com' })
      
      // Assert - Should now be able to access dashboard
      await page.goto('/dashboard')
      await expect(page.getByText('Server Instances')).toBeVisible()
    })
  })
})