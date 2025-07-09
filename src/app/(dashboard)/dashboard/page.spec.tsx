import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import DashboardPage from './page'

// Mock the dependencies
vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  Database: {
    getUserWithSubscription: vi.fn(),
    getUserMCPServers: vi.fn(),
  },
}))

vi.mock('@/lib/stripe', () => ({
  PRICING_TIERS: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      maxServers: 0,
      features: ['Built-in servers only'],
    },
    {
      id: 'dev',
      name: 'Dev',
      price: 9,
      maxServers: 1,
      features: ['1 custom server', 'Built-in servers'],
    },
  ],
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => 
    asChild ? children : <button {...props}>{children}</button>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className}>{children}</span>,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to sign-in when user is not authenticated', async () => {
    const mockGetCurrentUser = vi.mocked(await import('@/lib/auth')).getCurrentUser
    const mockRedirect = vi.mocked(redirect)
    
    mockGetCurrentUser.mockResolvedValue({ userId: null, user: null })

    await expect(async () => {
      render(await DashboardPage())
    }).rejects.toThrow()

    expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
  })

  it('should redirect to sign-in when user data fetch fails', async () => {
    const mockGetCurrentUser = vi.mocked(await import('@/lib/auth')).getCurrentUser
    const mockDatabase = vi.mocked(await import('@/lib/db')).Database
    const mockRedirect = vi.mocked(redirect)
    
    mockGetCurrentUser.mockResolvedValue({ userId: 'user_123', user: {} })
    mockDatabase.getUserWithSubscription.mockResolvedValue(null)

    await expect(async () => {
      render(await DashboardPage())
    }).rejects.toThrow()

    expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
  })

  it('should render dashboard when user is authenticated and has data', async () => {
    const mockGetCurrentUser = vi.mocked(await import('@/lib/auth')).getCurrentUser
    const mockDatabase = vi.mocked(await import('@/lib/db')).Database
    
    mockGetCurrentUser.mockResolvedValue({ userId: 'user_123', user: {} })
    mockDatabase.getUserWithSubscription.mockResolvedValue({
      user: { id: 'user_123', email: 'test@example.com', name: 'Test User' },
      subscription: { planId: 'free', status: 'active' },
    })
    mockDatabase.getUserMCPServers.mockResolvedValue([])

    render(await DashboardPage())

    expect(screen.getByText('Welcome back, Developer! 👋')).toBeInTheDocument()
    expect(screen.getByText('Current Plan')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Built-in only')).toBeInTheDocument()
  })

  it('should display correct server counts', async () => {
    const mockGetCurrentUser = vi.mocked(await import('@/lib/auth')).getCurrentUser
    const mockDatabase = vi.mocked(await import('@/lib/db')).Database
    
    mockGetCurrentUser.mockResolvedValue({ userId: 'user_123', user: {} })
    mockDatabase.getUserWithSubscription.mockResolvedValue({
      user: { id: 'user_123', email: 'test@example.com', name: 'Test User' },
      subscription: { planId: 'dev', status: 'active' },
    })
    mockDatabase.getUserMCPServers.mockResolvedValue([
      { id: '1', name: 'Test Server 1', status: 'active', createdAt: new Date().toISOString() },
      { id: '2', name: 'Test Server 2', status: 'inactive', createdAt: new Date().toISOString() },
    ])

    render(await DashboardPage())

    expect(screen.getByText('Dev')).toBeInTheDocument()
    expect(screen.getByText('2/1 servers')).toBeInTheDocument() // Over limit
    expect(screen.getByText('1')).toBeInTheDocument() // Active servers count
    expect(screen.getByText('2')).toBeInTheDocument() // Total servers count
  })

  it('should handle database errors gracefully', async () => {
    const mockGetCurrentUser = vi.mocked(await import('@/lib/auth')).getCurrentUser
    const mockDatabase = vi.mocked(await import('@/lib/db')).Database
    const mockRedirect = vi.mocked(redirect)
    
    mockGetCurrentUser.mockResolvedValue({ userId: 'user_123', user: {} })
    mockDatabase.getUserWithSubscription.mockRejectedValue(new Error('Database error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(async () => {
      render(await DashboardPage())
    }).rejects.toThrow()

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error))
    expect(mockRedirect).toHaveBeenCalledWith('/sign-in')

    consoleSpy.mockRestore()
  })
})