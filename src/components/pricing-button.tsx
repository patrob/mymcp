'use client'

import { Button } from '@/components/ui/button'
import { PRICING_TIERS } from '@/lib/stripe'

interface PricingButtonProps {
  tier: typeof PRICING_TIERS[0]
}

export function PricingButton({ tier }: PricingButtonProps) {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: tier.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <Button onClick={handleCheckout} className="w-full">
      Subscribe
    </Button>
  )
}