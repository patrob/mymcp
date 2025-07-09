import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BillingPeriodToggle } from './billing-period-toggle'

describe('BillingPeriodToggle', () => {
  it('renders with monthly selected by default', () => {
    const mockOnPeriodChange = vi.fn()
    
    render(<BillingPeriodToggle onPeriodChange={mockOnPeriodChange} />)
    
    const monthlyButton = screen.getByText('Monthly')
    const annuallyButton = screen.getByText('Annually')
    
    expect(monthlyButton).toBeInTheDocument()
    expect(annuallyButton).toBeInTheDocument()
    expect(screen.getByText('Save 17%')).toBeInTheDocument()
  })

  it('calls onPeriodChange when clicking annually button', () => {
    const mockOnPeriodChange = vi.fn()
    
    render(<BillingPeriodToggle onPeriodChange={mockOnPeriodChange} />)
    
    const annuallyButton = screen.getByText('Annually')
    fireEvent.click(annuallyButton)
    
    expect(mockOnPeriodChange).toHaveBeenCalledWith('annually')
  })

  it('calls onPeriodChange when clicking monthly button', () => {
    const mockOnPeriodChange = vi.fn()
    
    render(
      <BillingPeriodToggle 
        defaultPeriod="annually" 
        onPeriodChange={mockOnPeriodChange} 
      />
    )
    
    const monthlyButton = screen.getByText('Monthly')
    fireEvent.click(monthlyButton)
    
    expect(mockOnPeriodChange).toHaveBeenCalledWith('monthly')
  })

  it('renders with annually selected when defaultPeriod is annually', () => {
    const mockOnPeriodChange = vi.fn()
    
    render(
      <BillingPeriodToggle 
        defaultPeriod="annually" 
        onPeriodChange={mockOnPeriodChange} 
      />
    )
    
    const annuallyButton = screen.getByText('Annually')
    expect(annuallyButton).toHaveClass('bg-white', 'text-gray-900', 'shadow-sm')
  })

  it('displays savings badge on annually button', () => {
    const mockOnPeriodChange = vi.fn()
    
    render(<BillingPeriodToggle onPeriodChange={mockOnPeriodChange} />)
    
    const savingsBadge = screen.getByText('Save 17%')
    expect(savingsBadge).toBeInTheDocument()
    expect(savingsBadge).toHaveClass('bg-green-100', 'text-green-800')
  })
})