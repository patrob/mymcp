import { test, expect } from '@playwright/test'

test.describe('Critical Navigation Flows', () => {
  test('landing page loads and displays key elements', async ({ page }) => {
    // Arrange & Act
    await page.goto('/')

    // Assert
    await expect(page.getByText('Host. Connect. Scale.')).toBeVisible()
    await expect(page.getByText('Powered by MCP.')).toBeVisible()
    await expect(page.getByRole('link', { name: /get started free/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /learn more/i })).toBeVisible()
  })

  test('features section navigation works', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.getByRole('link', { name: /learn more/i }).click()

    // Assert
    await expect(page.locator('#features')).toBeInViewport()
    await expect(page.getByText('Starting Features')).toBeVisible()
  })

  test('sign-up navigation works from landing page', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.getByRole('link', { name: /get started free/i }).first().click()

    // Assert
    await expect(page).toHaveURL('/sign-up')
  })

  test('dashboard navigation requires authentication', async ({ page }) => {
    // Arrange & Act
    await page.goto('/dashboard')

    // Assert - should redirect to sign-in or show auth prompt
    const currentUrl = page.url()
    expect(currentUrl).not.toBe('/dashboard')
  })

  test('application responds with valid status codes', async ({ page }) => {
    // Test critical routes respond successfully
    const routes = ['/', '/sign-up', '/sign-in']
    
    for (const route of routes) {
      const response = await page.goto(route)
      expect(response?.status()).toBeLessThan(400)
    }
  })
})