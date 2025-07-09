import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import SignInPage from './page'

// Mock the dependencies
vi.mock('@clerk/nextjs', () => ({
  SignIn: ({ routing, afterSignInUrl, afterSignUpUrl, redirectUrl }: any) => (
    <div data-testid="sign-in-component">
      <div data-testid="routing">{routing}</div>
      <div data-testid="after-sign-in-url">{afterSignInUrl}</div>
      <div data-testid="after-sign-up-url">{afterSignUpUrl}</div>
      <div data-testid="redirect-url">{redirectUrl}</div>
    </div>
  ),
}))

vi.mock('@/lib/auth', () => ({
  getCurrentUserId: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to dashboard when user is already authenticated', async () => {
    const mockGetCurrentUserId = vi.mocked(await import('@/lib/auth')).getCurrentUserId
    const mockRedirect = vi.mocked(redirect)
    
    mockGetCurrentUserId.mockResolvedValue('user_123')

    // Since the component redirects, we need to handle this differently
    // The redirect will throw, so we catch it
    await expect(async () => {
      render(await SignInPage())
    }).rejects.toThrow()

    expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should render SignIn component when user is not authenticated', async () => {
    const mockGetCurrentUserId = vi.mocked(await import('@/lib/auth')).getCurrentUserId
    mockGetCurrentUserId.mockResolvedValue(null)

    render(await SignInPage())

    expect(screen.getByTestId('sign-in-component')).toBeInTheDocument()
    expect(screen.getByTestId('routing')).toHaveTextContent('hash')
    expect(screen.getByTestId('after-sign-in-url')).toHaveTextContent('/dashboard')
    expect(screen.getByTestId('after-sign-up-url')).toHaveTextContent('/dashboard')
    expect(screen.getByTestId('redirect-url')).toHaveTextContent('/dashboard')
  })

  it('should have proper styling classes', async () => {
    const mockGetCurrentUserId = vi.mocked(await import('@/lib/auth')).getCurrentUserId
    mockGetCurrentUserId.mockResolvedValue(null)

    const { container } = render(await SignInPage())

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen')
  })
})