import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PricingButton } from './pricing-button'

const mockTier = {
  id: 'pro' as const,
  name: 'Professional',
  price: 29,
  interval: 'month' as const,
  maxServers: 3,
  stripePriceId: 'price_pro_test',
  features: ['Feature 1', 'Feature 2'],
}

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PricingButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.href assignment
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
  })

  it('renders subscribe button with correct text', () => {
    render(<PricingButton tier={mockTier} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    expect(button).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-class'
    render(<PricingButton tier={mockTier} className={customClass} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    expect(button).toHaveClass(customClass)
  })

  it('calls checkout API with correct data when clicked', async () => {
    const mockResponse = { url: 'https://checkout.stripe.com/test' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    render(<PricingButton tier={mockTier} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    fireEvent.click(button)
    
    expect(mockFetch).toHaveBeenCalledWith('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: 'pro',
        interval: 'month',
      }),
    })
  })

  it('redirects to checkout URL on successful API call', async () => {
    const checkoutUrl = 'https://checkout.stripe.com/test'
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: checkoutUrl }),
    })

    render(<PricingButton tier={mockTier} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(window.location.href).toBe(checkoutUrl)
    })
  })

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'API Error' }),
    })

    render(<PricingButton tier={mockTier} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Failed to start checkout. Please try again.')
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('handles network error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<PricingButton tier={mockTier} />)
    
    const button = screen.getByRole('button', { name: 'Subscribe' })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith('Failed to start checkout. Please try again.')
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })
})