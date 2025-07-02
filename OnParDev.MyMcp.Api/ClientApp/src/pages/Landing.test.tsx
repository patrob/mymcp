import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Landing from './Landing'
import { useConfiguration } from '@/hooks/useConfiguration'
import type { ConfigurationResponse } from '@/api/models/ConfigurationResponse'

// Mock the configuration hook
vi.mock('@/hooks/useConfiguration', () => ({
  useConfiguration: vi.fn()
}))

// Mock Clerk components
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

describe('Landing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseConfiguration.mockReturnValue({ 
      config: createMockConfig(), 
      isLoading: false 
    })
  })

  describe('Hero Section', () => {
    it('displays main heading', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Host. Connect. Scale.')).toBeInTheDocument()
    })

    it('displays MCP tagline', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Powered by MCP.')).toBeInTheDocument()
    })

    it('displays hero description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Your gateway to hosted MCP servers/)).toBeInTheDocument()
    })

    it('displays Get Started Free button', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /get started free/i })).toBeInTheDocument()
    })

    it('has correct Get Started button href', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /get started free/i })).toHaveAttribute('href', '/sign-up')
    })

    it('displays Learn More button', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument()
    })

    it('has correct Learn More button href', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute('href', '#features')
    })
  })

  describe('Starting Features Section', () => {
    it('displays Starting Features heading', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Starting Features')).toBeInTheDocument()
    })

    it('displays Starting Features description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Everything you need to get started with hosted MCP servers/)).toBeInTheDocument()
    })

    it('displays Hosted MCP Servers feature', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Hosted MCP Servers')).toBeInTheDocument()
    })

    it('displays Hosted MCP Servers description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Access pre-configured MCP servers including GitHub integration/)).toBeInTheDocument()
    })

    it('displays Free Tier Access feature', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Free Tier Access')).toBeInTheDocument()
    })

    it('displays free tier limit information', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Get started with 100 requests per month completely free/)).toBeInTheDocument()
    })

    it('displays Instant Connection feature', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Instant Connection')).toBeInTheDocument()
    })

    it('displays connection process description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Connect your AI applications in minutes/)).toBeInTheDocument()
    })
  })

  describe('Upcoming Features Section', () => {
    it('displays Upcoming Features heading', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Upcoming Features')).toBeInTheDocument()
    })

    it('displays Upcoming Features description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Exciting capabilities coming soon to expand your MCP possibilities/)).toBeInTheDocument()
    })

    it('displays MCP Marketplace feature', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('MCP Marketplace')).toBeInTheDocument()
    })

    it('displays marketplace description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Browse and deploy community-created MCP servers/)).toBeInTheDocument()
    })

    it('displays Custom Server Deployment feature', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Custom Server Deployment')).toBeInTheDocument()
    })

    it('displays custom deployment description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Deploy your own MCP servers from GitHub repositories/)).toBeInTheDocument()
    })
  })

  describe('Call to Action Section', () => {
    it('displays CTA heading', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText('Ready to get started?')).toBeInTheDocument()
    })

    it('displays CTA description', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByText(/Join the growing community of developers building the future/)).toBeInTheDocument()
    })

    it('displays Start Building Today button', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /start building today/i })).toBeInTheDocument()
    })

    it('has correct Start Building Today button href', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('link', { name: /start building today/i })).toHaveAttribute('href', '/sign-up')
    })
  })

  describe('Visual Elements', () => {
    it('displays hero icon', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByTestId('hero-icon')).toBeInTheDocument()
    })

    it('displays starting features icons', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getAllByTestId('feature-icon')).toHaveLength(3)
    })

    it('displays upcoming features icons', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getAllByTestId('upcoming-feature-icon')).toHaveLength(2)
    })
  })

  describe('Layout Structure', () => {
    it('renders main content section', () => {
      // Arrange & Act
      render(<Landing />)

      // Assert
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('displays features section with correct id', () => {
      // Arrange & Act
      render(<Landing />)
      const featuresSection = document.getElementById('features')

      // Assert
      expect(featuresSection).toBeInTheDocument()
    })

    it('renders gradient background container', () => {
      // Arrange & Act
      const { container } = render(<Landing />)
      const backgroundDiv = container.querySelector('.bg-gradient-to-br')

      // Assert
      expect(backgroundDiv).toBeInTheDocument()
    })
  })
})