import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
}))

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, ...props }: any) => {
      return React.createElement('a', { href, ...props }, children)
    },
  }
})

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(() => ({
    isLoaded: true,
    isSignedIn: false,
    userId: null,
  })),
  useUser: vi.fn(() => ({
    isLoaded: true,
    user: null,
  })),
  SignIn: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'clerk-signin' }, children)),
  SignUp: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'clerk-signup' }, children)),
  ClerkProvider: vi.fn(({ children }) => React.createElement('div', null, children)),
}))

// Mock environment variables
Object.defineProperty(process, 'env', {
  value: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_fake',
    CLERK_SECRET_KEY: 'sk_test_fake',
    STRIPE_SECRET_KEY: 'sk_test_fake',
    STRIPE_DEV_PRICE_ID: 'price_dev_test',
    STRIPE_PRO_PRICE_ID: 'price_pro_test',
    STRIPE_TEAM_PRICE_ID: 'price_team_test',
    STRIPE_DEV_ANNUAL_PRICE_ID: 'price_dev_annual_test',
    STRIPE_PRO_ANNUAL_PRICE_ID: 'price_pro_annual_test',
    STRIPE_TEAM_ANNUAL_PRICE_ID: 'price_team_annual_test',
  },
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})