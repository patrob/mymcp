import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PublicLayout } from './PublicLayout'
import { useConfiguration } from '@/contexts/ConfigurationContext'
import type { ConfigurationResponse } from '@/api/models/ConfigurationResponse'

// Mock the configuration context
vi.mock('@/contexts/ConfigurationContext', () => ({
  useConfiguration: vi.fn()
}))

// Mock Clerk components with more realistic behavior
vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-in">{children}</div>
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-out">{children}</div>
  ),
  SignInButton: ({ 
    children, 
    mode = 'redirect' 
  }: { 
    children: React.ReactNode
    mode?: 'modal' | 'redirect'
  }) => (
    <div data-testid="sign-in-button" data-mode={mode}>
      {children}
    </div>
  ),
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl: string }) => (
    <div data-testid="user-button" data-sign-out-url={afterSignOutUrl}>
      User Menu
    </div>
  )
}))

const mockUseConfiguration = useConfiguration as ReturnType<typeof vi.fn>

// Helper function to create mock configuration
const createMockConfig = (overrides: Partial<ConfigurationResponse> = {}): ConfigurationResponse => ({
  clerk: {
    publishableKey: '',
    authority: '',
    afterSignOutUrl: '/'
  },
  api: {
    baseUrl: 'http://localhost:5099',
    version: 'v1'
  },
  features: {
    enableAuth: false,
    enableAnalytics: false
  },
  ...overrides
})

describe('PublicLayout', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('shows loading skeleton when configuration is loading', () => {
      mockUseConfiguration.mockReturnValue({
        config: null,
        isLoading: true
      })

      render(
        <PublicLayout>
          <div>Test content</div>
        </PublicLayout>
      )

      expect(screen.getByText('MyMcp')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Should show loading skeleton instead of navigation buttons
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
      expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument()
    })
  })

  describe('Authentication Enabled', () => {
    it('shows sign in button when auth is enabled with valid clerk configuration', () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: {
          publishableKey: 'pk_test_123456789',
          authority: 'https://test-app.clerk.accounts.dev',
          afterSignOutUrl: '/'
        }
      })

      mockUseConfiguration.mockReturnValue({
        config,
        isLoading: false
      })

      render(
        <PublicLayout>
          <div>Test content</div>
        </PublicLayout>
      )

      // Should wrap content in ClerkProvider when auth is enabled
      expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
      
      // Should show navigation links
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('MyMcp')).toBeInTheDocument()
      
      // Should show sign in components for signed out users
      expect(screen.getByTestId('signed-out')).toBeInTheDocument()
      expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      
      // Should show components for signed in users
      expect(screen.getByTestId('signed-in')).toBeInTheDocument()
      expect(screen.getByTestId('user-button')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('configures SignInButton with modal mode', () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })

      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Test</div></PublicLayout>)

      const signInButton = screen.getByTestId('sign-in-button')
      expect(signInButton).toHaveAttribute('data-mode', 'modal')
    })

    it('configures UserButton with correct afterSignOutUrl', () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { 
          publishableKey: 'pk_test_123', 
          authority: 'https://test.clerk.dev', 
          afterSignOutUrl: '/custom-signout'
        }
      })

      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Test</div></PublicLayout>)

      const userButton = screen.getByTestId('user-button')
      expect(userButton).toHaveAttribute('data-sign-out-url', '/custom-signout')
    })
  })

  describe('Authentication Disabled', () => {
    it('shows dashboard link when auth is disabled', () => {
      const config = createMockConfig({
        features: { enableAuth: false, enableAnalytics: false }
      })

      mockUseConfiguration.mockReturnValue({
        config,
        isLoading: false
      })

      render(
        <PublicLayout>
          <div>Test content</div>
        </PublicLayout>
      )

      // Should not wrap in ClerkProvider
      expect(screen.queryByTestId('clerk-provider')).not.toBeInTheDocument()
      
      // Should show basic navigation
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('MyMcp')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      
      // Should not show auth components
      expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('user-button')).not.toBeInTheDocument()
    })

    it('shows dashboard link when clerk publishable key is missing', () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: '', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })

      mockUseConfiguration.mockReturnValue({
        config,
        isLoading: false
      })

      render(
        <PublicLayout>
          <div>Test content</div>
        </PublicLayout>
      )

      // Should not show auth components when key is missing
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('clerk-provider')).not.toBeInTheDocument()
    })

    it('shows dashboard link when clerk authority is missing', () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: '', afterSignOutUrl: '/' }
      })

      mockUseConfiguration.mockReturnValue({
        config,
        isLoading: false
      })

      render(
        <PublicLayout>
          <div>Test content</div>
        </PublicLayout>
      )

      // Should still show auth components even if authority is missing
      // (Clerk might handle this internally)
      expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
      expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('renders children content in main section', () => {
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(
        <PublicLayout>
          <div data-testid="test-content">Custom test content</div>
        </PublicLayout>
      )

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(screen.getByText('Custom test content')).toBeInTheDocument()
    })

    it('renders header with navigation', () => {
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Content</div></PublicLayout>)

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(screen.getByText('MyMcp')).toBeInTheDocument()
    })

    it('renders footer with copyright notice', () => {
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Content</div></PublicLayout>)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(screen.getByText('© 2024 MyMcp. All rights reserved.')).toBeInTheDocument()
    })
  })

  describe('Navigation Interactions', () => {
    it('has clickable home link', async () => {
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Content</div></PublicLayout>)

      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('has clickable dashboard link when auth is disabled', async () => {
      const config = createMockConfig({ features: { enableAuth: false, enableAnalytics: false } })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Content</div></PublicLayout>)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })

    it('has clickable sign in button when auth is enabled', async () => {
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      render(<PublicLayout><div>Content</div></PublicLayout>)

      const signInButton = screen.getByRole('button', { name: /sign in/i })
      expect(signInButton).toBeInTheDocument()
      
      // Test that the button can be clicked
      await user.click(signInButton)
      // In a real scenario, this would trigger Clerk's sign-in modal
    })
  })
})