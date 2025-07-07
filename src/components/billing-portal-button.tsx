'use client'

import { Button } from '@/components/ui/button'

export function BillingPortalButton() {
  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening billing portal:', error)
      alert('Failed to open billing portal. Please try again.')
    }
  }

  return (
    <Button onClick={handleManageBilling} variant="outline">
      Manage Billing
    </Button>
  )
}