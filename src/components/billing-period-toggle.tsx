'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface BillingPeriodToggleProps {
  defaultPeriod?: 'monthly' | 'annually'
  onPeriodChange: (period: 'monthly' | 'annually') => void
}

export function BillingPeriodToggle({ 
  defaultPeriod = 'monthly', 
  onPeriodChange 
}: BillingPeriodToggleProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annually'>(defaultPeriod)

  const handlePeriodChange = (period: 'monthly' | 'annually') => {
    setSelectedPeriod(period)
    onPeriodChange(period)
  }

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <Button
          variant={selectedPeriod === 'monthly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePeriodChange('monthly')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedPeriod === 'monthly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monthly
        </Button>
        <Button
          variant={selectedPeriod === 'annually' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePeriodChange('annually')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedPeriod === 'annually'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Annually
          <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
            Save 17%
          </span>
        </Button>
      </div>
    </div>
  )
}