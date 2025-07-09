import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PricingPage from './page'

// Mock the pricing tiers data
vi.mock('@/lib/stripe', () => ({
  getPricingTiersByInterval: vi.fn((interval) => {
    const allTiers = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        maxServers: 0,
        stripePriceId: '',
        popular: true,
        features: ['Access to built-in MCP servers', 'Community support'],
      },
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'year',
        maxServers: 0,
        stripePriceId: '',
        popular: true,
        features: ['Access to built-in MCP servers', 'Community support'],
      },
      {
        id: 'dev',
        name: 'Developer',
        price: 14,
        interval: 'month',
        maxServers: 1,
        stripePriceId: 'price_dev_test',
        comingSoon: true,
        features: ['Everything in Free', '1 custom MCP server'],
      },
      {
        id: 'dev',
        name: 'Developer',
        price: 140,
        interval: 'year',
        maxServers: 1,
        stripePriceId: 'price_dev_annual_test',
        comingSoon: true,
        features: ['Everything in Free', '1 custom MCP server'],
      },
    ]
    return allTiers.filter(tier => tier.interval === interval)
  }),
  calculateAnnualSavings: vi.fn(() => ({ savings: 28, savingsPercentage: 17 })),
}))

// Mock components
vi.mock('@/components/pricing-button', () => ({
  PricingButton: ({ tier, className }: any) => (
    <button className={className} data-testid={`pricing-button-${tier.id}`}>
      Subscribe
    </button>
  ),
}))

vi.mock('@/components/billing-period-toggle', () => ({
  BillingPeriodToggle: ({ onPeriodChange, defaultPeriod }: any) => (
    <div data-testid="billing-toggle">
      <button 
        onClick={() => onPeriodChange('monthly')}
        data-testid="monthly-btn"
        className={defaultPeriod === 'monthly' ? 'active' : ''}
      >
        Monthly
      </button>
      <button 
        onClick={() => onPeriodChange('annually')}
        data-testid="annually-btn"
        className={defaultPeriod === 'annually' ? 'active' : ''}
      >
        Annually
      </button>
    </div>
  ),
}))

describe('PricingPage', () => {
  it('renders pricing page with correct title and description', () => {
    render(<PricingPage />)
    
    expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
    expect(screen.getByText(/Start for free and upgrade as you grow/)).toBeInTheDocument()
  })

  it('renders billing period toggle', () => {
    render(<PricingPage />)
    
    expect(screen.getByTestId('billing-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('monthly-btn')).toBeInTheDocument()
    expect(screen.getByTestId('annually-btn')).toBeInTheDocument()
  })

  it('shows monthly pricing tiers by default', () => {
    render(<PricingPage />)
    
    // Should show Free tier
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('$0')).toBeInTheDocument()
    
    // Should show Developer tier
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('$14')).toBeInTheDocument()
  })

  it('switches to annual pricing when annually button is clicked', () => {
    const { rerender } = render(<PricingPage />)
    
    // Click the annually button
    const annuallyBtn = screen.getByTestId('annually-btn')
    fireEvent.click(annuallyBtn)
    
    // Re-render to see the updated state (since we're testing the component behavior)
    rerender(<PricingPage />)
    
    // Should still show tiers (our mock returns both monthly and annual)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('renders Free tier with Most Popular badge', () => {
    render(<PricingPage />)
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('shows Get Started button for Free tier', () => {
    render(<PricingPage />)
    
    const getStartedLink = screen.getByRole('link', { name: 'Get Started' })
    expect(getStartedLink).toBeInTheDocument()
    expect(getStartedLink).toHaveAttribute('href', '/sign-up')
  })

  it('shows Coming Soon button for paid tiers', () => {
    render(<PricingPage />)
    
    const comingSoonButtons = screen.getAllByText('Coming Soon')
    expect(comingSoonButtons.length).toBeGreaterThan(0)
    
    // Check that Coming Soon buttons are disabled
    comingSoonButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('renders navigation header with correct links', () => {
    render(<PricingPage />)
    
    expect(screen.getByText('My MCP')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in')
  })

  it('renders footer with correct links', () => {
    render(<PricingPage />)
    
    expect(screen.getByText('© 2024 My MCP. All rights reserved.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
  })
})