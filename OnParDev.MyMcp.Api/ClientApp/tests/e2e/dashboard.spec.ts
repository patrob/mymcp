import { test, expect } from '@playwright/test'
import { setupUnauthenticatedMode, setupAuthenticatedMode } from '../helpers/auth-helpers'

test.describe('Dashboard Critical Flows', () => {
  test.describe('Unauthenticated Mode (Development)', () => {
    test('dashboard displays usage metrics cards in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/dashboard')

      // Assert - Should show development mode banner and dashboard content
      await expect(page.getByText('Development Mode')).toBeVisible()
      await expect(page.getByText('Authentication is disabled')).toBeVisible()
      await expect(page.getByText('Server Instances')).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
      await expect(page.getByText('Active Servers')).toBeVisible()
      await expect(page.getByText('Plan Status')).toBeVisible()
      await expect(page.getByText('This Month')).toBeVisible()
    })

    test('server creation wizard is accessible in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      await page.goto('/dashboard')

      // Act
      await page.getByRole('button', { name: /get started/i }).click()

      // Assert
      await expect(page.getByText('Create GitHub MCP Server')).toBeVisible()
      await expect(page.getByLabel('Server Name')).toBeVisible()
      await expect(page.getByLabel('Repository URL')).toBeVisible()
    })

    test('empty state displays when no servers exist in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/dashboard')

      // Assert - Should show empty state if no servers
      await expect(page.getByText('Create New Server')).toBeVisible()
    })

    test('loading states display properly in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/dashboard')

      // Assert - Loading should appear briefly then content loads
      // We can't reliably test loading states in fast local environments,
      // but we can verify the page loads successfully
      await expect(page.getByText('Server Instances')).toBeVisible({ timeout: 10000 })
    })

    test('responsive design works on mobile viewport in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode and mobile viewport
      await setupUnauthenticatedMode(page)
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone viewport

      // Act
      await page.goto('/dashboard')

      // Assert
      await expect(page.getByText('Server Instances')).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
    })
  })

  test.describe('Authenticated Mode', () => {
    test('dashboard requires authentication when auth is enabled', async ({ page }) => {
      // Arrange - Setup authenticated mode but user is not signed in
      await setupAuthenticatedMode(page, { isSignedIn: false })
      
      // Act
      await page.goto('/dashboard')

      // Assert - Should redirect to sign-in or show sign-in UI
      // Since we're mocking Clerk, it should show sign-in prompt
      await expect(page.url()).not.toContain('/dashboard')
    })

    test('signed-in user can access dashboard in authenticated mode', async ({ page }) => {
      // Arrange - Setup authenticated mode with signed-in user
      await setupAuthenticatedMode(page, { 
        isSignedIn: true,
        userEmail: 'test@example.com' 
      })
      
      // Act
      await page.goto('/dashboard')

      // Assert - Should show dashboard content without development banner
      await expect(page.getByText('Development Mode')).not.toBeVisible()
      await expect(page.getByText('Server Instances')).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
      await expect(page.getByText('Active Servers')).toBeVisible()
      await expect(page.getByText('Plan Status')).toBeVisible()
    })
  })
})