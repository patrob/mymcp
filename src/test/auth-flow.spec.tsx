import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock Clerk entirely for E2E auth flow testing
const mockClerkUser = {
  id: 'user_123',
  emailAddress: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
}

const mockClerkSession = {
  id: 'session_123',
  userId: 'user_123',
  status: 'active',
}

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

vi.mock('@clerk/nextjs', () => ({
  SignIn: ({ routing, afterSignInUrl }: any) => (
    <div data-testid="sign-in-component">
      Mock SignIn - routing: {routing}, redirect: {afterSignInUrl}
    </div>
  ),
  SignUp: ({ routing, afterSignUpUrl }: any) => (
    <div data-testid="sign-up-component">
      Mock SignUp - routing: {routing}, redirect: {afterSignUpUrl}
    </div>
  ),
  ClerkProvider: ({ children }: any) => <div>{children}</div>,
  useAuth: () => ({
    isSignedIn: true,
    userId: 'user_123',
    isLoaded: true,
  }),
  useUser: () => ({
    user: mockClerkUser,
    isLoaded: true,
  }),
}))

vi.mock('@/lib/db', () => ({
  Database: {
    getUserWithSubscription: vi.fn().mockResolvedValue({
      user: { id: 'user_123', email: 'test@example.com', name: 'Test User' },
      subscription: { planId: 'free', status: 'active' },
    }),
    getUserMCPServers: vi.fn().mockResolvedValue([]),
    createUser: vi.fn(),
    createSubscription: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// Mock UI components for cleaner tests
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => 
    asChild ? children : <button {...props} data-testid="button">{children}</button>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className} data-testid="badge">{children}</span>,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href} data-testid="link">{children}</a>,
}))

describe('Authentication Flow End-to-End', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Unauthenticated User Flow', () => {
    beforeEach(() => {
      // Mock unauthenticated state
      vi.mocked(require('@clerk/nextjs/server').auth).mockResolvedValue({ userId: null })
    })

    it('should show sign-in component for unauthenticated users', async () => {
      const SignInPage = (await import('../app/(auth)/sign-in/page')).default
      
      render(await SignInPage())
      
      expect(screen.getByTestId('sign-in-component')).toBeInTheDocument()
      expect(screen.getByText(/Mock SignIn - routing: hash/)).toBeInTheDocument()
    })

    it('should show sign-up component for new users', async () => {
      const SignUpPage = (await import('../app/(auth)/sign-up/page')).default
      
      render(await SignUpPage())
      
      expect(screen.getByTestId('sign-up-component')).toBeInTheDocument()
      expect(screen.getByText(/Mock SignUp - routing: hash/)).toBeInTheDocument()
    })
  })

  describe('Authenticated User Flow', () => {
    beforeEach(() => {
      // Mock authenticated state
      vi.mocked(require('@clerk/nextjs/server').auth).mockResolvedValue({ 
        userId: 'user_123',
        user: mockClerkUser 
      })
      vi.mocked(require('@clerk/nextjs/server').currentUser).mockResolvedValue(mockClerkUser)
    })

    it('should redirect authenticated users away from sign-in page', async () => {
      const SignInPage = (await import('../app/(auth)/sign-in/page')).default
      const mockRedirect = vi.mocked(require('next/navigation').redirect)
      
      await expect(async () => {
        render(await SignInPage())
      }).rejects.toThrow()
      
      expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should redirect authenticated users away from sign-up page', async () => {
      const SignUpPage = (await import('../app/(auth)/sign-up/page')).default
      const mockRedirect = vi.mocked(require('next/navigation').redirect)
      
      await expect(async () => {
        render(await SignUpPage())
      }).rejects.toThrow()
      
      expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should render dashboard for authenticated users', async () => {
      const DashboardPage = (await import('../app/(dashboard)/dashboard/page')).default
      
      render(await DashboardPage())
      
      expect(screen.getByText('Welcome back, Developer! 👋')).toBeInTheDocument()
      expect(screen.getByText('Current Plan')).toBeInTheDocument()
    })

    it('should render settings page for authenticated users', async () => {
      const SettingsPage = (await import('../app/(dashboard)/settings/page')).default
      
      render(await SettingsPage())
      
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Account Information')).toBeInTheDocument()
    })
  })

  describe('Database Integration', () => {
    beforeEach(() => {
      vi.mocked(require('@clerk/nextjs/server').auth).mockResolvedValue({ 
        userId: 'user_123',
        user: mockClerkUser 
      })
    })

    it('should handle database connection errors gracefully', async () => {
      const mockDatabase = vi.mocked(require('@/lib/db').Database)
      mockDatabase.getUserWithSubscription.mockRejectedValue(new Error('Database connection failed'))
      
      const DashboardPage = (await import('../app/(dashboard)/dashboard/page')).default
      const mockRedirect = vi.mocked(require('next/navigation').redirect)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await expect(async () => {
        render(await DashboardPage())
      }).rejects.toThrow()
      
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error))
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
      
      consoleSpy.mockRestore()
    })

    it('should handle missing user data in database', async () => {
      const mockDatabase = vi.mocked(require('@/lib/db').Database)
      mockDatabase.getUserWithSubscription.mockResolvedValue(null)
      
      const DashboardPage = (await import('../app/(dashboard)/dashboard/page')).default
      const mockRedirect = vi.mocked(require('next/navigation').redirect)
      
      await expect(async () => {
        render(await DashboardPage())
      }).rejects.toThrow()
      
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
    })
  })

  describe('Auth Helper Functions', () => {
    it('should handle auth errors in getCurrentUserId', async () => {
      vi.mocked(require('@clerk/nextjs/server').auth).mockRejectedValue(new Error('Auth service unavailable'))
      
      const { getCurrentUserId } = await import('../lib/auth')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await getCurrentUserId()
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error getting current user ID:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should handle auth errors in getCurrentUser', async () => {
      vi.mocked(require('@clerk/nextjs/server').auth).mockRejectedValue(new Error('Auth service unavailable'))
      
      const { getCurrentUser } = await import('../lib/auth')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await getCurrentUser()
      
      expect(result).toEqual({ userId: null, user: null })
      expect(consoleSpy).toHaveBeenCalledWith('Error getting current user:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})