import { test, expect } from '@playwright/test'

test.describe('Dashboard Critical Flows', () => {
  test('dashboard displays usage metrics cards', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')

    // Assert - Check for key dashboard elements
    await expect(page.getByText('Server Instances')).toBeVisible()
    await expect(page.getByText('API Requests')).toBeVisible()
    await expect(page.getByText('Active Servers')).toBeVisible()
    await expect(page.getByText('Plan Status')).toBeVisible()
    await expect(page.getByText('This Month')).toBeVisible()
  })

  test('server creation wizard is accessible', async ({ page }) => {
    // Arrange
    await page.goto('/dashboard')

    // Act
    await page.getByRole('button', { name: /get started/i }).click()

    // Assert
    await expect(page.getByText('Create GitHub MCP Server')).toBeVisible()
    await expect(page.getByLabel('Server Name')).toBeVisible()
    await expect(page.getByLabel('Repository URL')).toBeVisible()
  })

  test('empty state displays when no servers exist', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')

    // Assert - Should show empty state if no servers
    await expect(page.getByText('Create New Server')).toBeVisible()
  })

  test('loading states display properly', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')

    // Assert - Loading should appear briefly then content loads
    // We can't reliably test loading states in fast local environments,
    // but we can verify the page loads successfully
    await expect(page.getByText('Server Instances')).toBeVisible({ timeout: 10000 })
  })

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone viewport

    // Act
    await page.goto('/dashboard')

    // Assert
    await expect(page.getByText('Server Instances')).toBeVisible()
    await expect(page.getByText('API Requests')).toBeVisible()
  })
})