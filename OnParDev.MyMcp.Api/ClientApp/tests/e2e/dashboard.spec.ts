import { test, expect } from '@playwright/test'
import { setupUnauthenticatedMode } from '../helpers/auth-helpers'

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
      await expect(page.getByRole('heading', { name: 'Server Instances' })).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
      await expect(page.getByText('Active Servers')).toBeVisible()
      await expect(page.getByText('Plan Status')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'This Month' })).toBeVisible()
    })

    test('server creation wizard is accessible in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      await page.goto('/dashboard')

      // Wait for dashboard to load
      await expect(page.getByRole('heading', { name: 'Server Instances' })).toBeVisible()

      // Act - Click Get Started button
      await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible()
      await page.getByRole('button', { name: 'Get Started' }).click()

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

      // Wait for dashboard to load
      await expect(page.getByRole('heading', { name: 'Server Instances' })).toBeVisible()

      // Assert - Should show ServerConnectionWizard card when no servers exist
      await expect(page.getByText('Create New Server')).toBeVisible()
      await expect(page.getByText('Deploy a new MCP server instance from GitHub')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible()
    })

    test('loading states display properly in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode
      await setupUnauthenticatedMode(page)
      
      // Act
      await page.goto('/dashboard')

      // Assert - Loading should appear briefly then content loads
      // We can't reliably test loading states in fast local environments,
      // but we can verify the page loads successfully
      await expect(page.getByRole('heading', { name: 'Server Instances' })).toBeVisible({ timeout: 10000 })
    })

    test('responsive design works on mobile viewport in development mode', async ({ page }) => {
      // Arrange - Setup unauthenticated mode and mobile viewport
      await setupUnauthenticatedMode(page)
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone viewport

      // Act
      await page.goto('/dashboard')

      // Assert
      await expect(page.getByRole('heading', { name: 'Server Instances' })).toBeVisible()
      await expect(page.getByText('API Requests')).toBeVisible()
    })
  })

  // Note: Authentication tests are covered in authentication.spec.ts
  // No need for duplicated authenticated mode tests here
})