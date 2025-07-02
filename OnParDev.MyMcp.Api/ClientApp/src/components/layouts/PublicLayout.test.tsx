import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublicLayout } from './PublicLayout'
import { useConfiguration } from '@/hooks/useConfiguration'
import type { ConfigurationResponse } from '@/api/models/ConfigurationResponse'

// Mock the configuration hook
vi.mock('@/hooks/useConfiguration', () => ({
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('shows brand name when configuration is loading', () => {
      // Arrange
      mockUseConfiguration.mockReturnValue({ config: null, isLoading: true })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByText('MyMcp')).toBeInTheDocument()
    })

    it('shows main content when configuration is loading', () => {
      // Arrange
      mockUseConfiguration.mockReturnValue({ config: null, isLoading: true })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('hides navigation when configuration is loading', () => {
      // Arrange
      mockUseConfiguration.mockReturnValue({ config: null, isLoading: true })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
    })
  })

  describe('Authentication Enabled', () => {
    it('wraps content in ClerkProvider when auth is enabled', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByTestId('clerk-provider')).toBeInTheDocument()
    })

    it('shows sign in components when auth is enabled', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
    })

    it('configures SignInButton with modal mode', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test</div></PublicLayout>)

      // Assert
      expect(screen.getByTestId('sign-in-button')).toHaveAttribute('data-mode', 'modal')
    })
  })

  describe('Authentication Disabled', () => {
    it('shows dashboard link when auth is disabled', () => {
      // Arrange
      const config = createMockConfig({ features: { enableAuth: false, enableAnalytics: false } })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('does not wrap in ClerkProvider when auth disabled', () => {
      // Arrange
      const config = createMockConfig({ features: { enableAuth: false, enableAnalytics: false } })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.queryByTestId('clerk-provider')).not.toBeInTheDocument()
    })

    it('hides auth components when auth is disabled', () => {
      // Arrange
      const config = createMockConfig({ features: { enableAuth: false, enableAnalytics: false } })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
    })
  })

  describe('Missing Configuration', () => {
    it('shows dashboard link when clerk key is missing', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: '', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('does not show auth when clerk key is missing', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: '', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Test content</div></PublicLayout>)

      // Assert
      expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('renders children in main section', () => {
      // Arrange
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div data-testid="test-content">Custom content</div></PublicLayout>)

      // Assert
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })

    it('renders header with navigation', () => {
      // Arrange
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('renders footer with copyright', () => {
      // Arrange
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Content</div></PublicLayout>)

      // Assert
      expect(screen.getByText(`© ${new Date().getFullYear()} On PAR Dev, LLC. All rights reserved.`)).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('has correct home link href', () => {
      // Arrange
      const config = createMockConfig()
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    })

    it('has correct dashboard link href when auth disabled', () => {
      // Arrange
      const config = createMockConfig({ features: { enableAuth: false, enableAnalytics: false } })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Content</div></PublicLayout>)

      // Assert
      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
    })

    it('can click sign in button when auth enabled', () => {
      // Arrange
      const config = createMockConfig({
        features: { enableAuth: true, enableAnalytics: false },
        clerk: { publishableKey: 'pk_test_123', authority: 'https://test.clerk.dev', afterSignOutUrl: '/' }
      })
      mockUseConfiguration.mockReturnValue({ config, isLoading: false })

      // Act
      render(<PublicLayout><div>Content</div></PublicLayout>)
      const signInButton = screen.getByRole('button', { name: /sign in/i })

      // Assert
      expect(signInButton).toBeInTheDocument()
    })
  })
})