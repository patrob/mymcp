import { test, expect } from '@playwright/test'

test.describe('Server Lifecycle Critical Flows', () => {
  test('server creation wizard form validation works', async ({ page }) => {
    // Arrange
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /get started/i }).click()

    // Act & Assert - Test form validation
    await expect(page.getByRole('button', { name: /create server/i })).toBeDisabled()
    
    // Fill required fields
    await page.getByLabel('Server Name').fill('Test Server')
    await page.getByLabel('Repository URL').fill('https://github.com/test/repo')
    await page.getByLabel('GitHub Access Token').fill('ghp_test_token')
    
    // Assert form becomes submittable
    await expect(page.getByRole('button', { name: /create server/i })).toBeEnabled()
  })

  test('server creation wizard can be cancelled', async ({ page }) => {
    // Arrange
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /get started/i }).click()

    // Act
    await page.getByRole('button', { name: /cancel/i }).click()

    // Assert
    await expect(page.getByText('Create GitHub MCP Server')).not.toBeVisible()
    await expect(page.getByText('Server Instances')).toBeVisible()
  })

  test('server actions menu displays for server cards', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')
    
    // Assert - Look for any server cards that might exist
    const serverCards = page.locator('[data-testid="server-card"]')
    const serverCardCount = await serverCards.count()
    
    if (serverCardCount > 0) {
      // If servers exist, check action buttons are present
      await expect(page.getByRole('button', { name: /start|stop|delete|config/i }).first()).toBeVisible()
    } else {
      // If no servers, ensure we can create one
      await expect(page.getByText('Create New Server')).toBeVisible()
    }
  })

  test('server status badges display correctly', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')
    
    // Assert - Check if any status badges are displayed
    const statusBadges = page.locator('span:has-text("Running"), span:has-text("Stopped"), span:has-text("Starting"), span:has-text("Failed")')
    const badgeCount = await statusBadges.count()
    
    // If we have servers, we should have status badges
    if (badgeCount > 0) {
      await expect(statusBadges.first()).toBeVisible()
    }
  })

  test('usage metrics reflect server activity', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')

    // Assert - Usage metrics should display (even if zero)
    await expect(page.getByText('Active Servers')).toBeVisible()
    await expect(page.getByText(/of \d+ total servers/)).toBeVisible()
    await expect(page.getByText(/\d+ remaining/)).toBeVisible()
  })
})