import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsageMetrics } from './UsageMetrics'

describe('UsageMetrics', () => {
  describe('API Requests Display', () => {
    it('displays default request values', () => {
      // Arrange & Act
      render(<UsageMetrics />)

      // Assert
      expect(screen.getByText('API Requests')).toBeInTheDocument()
      expect(screen.getByText('of 100 this month')).toBeInTheDocument()
    })

    it('displays custom request values', () => {
      // Arrange & Act
      render(<UsageMetrics requestsUsed={75} requestsLimit={200} />)

      // Assert
      expect(screen.getByText('75')).toBeInTheDocument()
      expect(screen.getByText('of 200 this month')).toBeInTheDocument()
    })

    it('displays remaining requests correctly', () => {
      // Arrange & Act
      render(<UsageMetrics requestsUsed={25} requestsLimit={100} />)

      // Assert
      expect(screen.getByText('75 remaining')).toBeInTheDocument()
    })
  })

  describe('Server Activity Display', () => {
    it('displays default server values', () => {
      // Arrange & Act
      render(<UsageMetrics />)

      // Assert
      expect(screen.getByText('Active Servers')).toBeInTheDocument()
      expect(screen.getByText('of 0 total servers')).toBeInTheDocument()
    })

    it('displays custom server values', () => {
      // Arrange & Act
      render(<UsageMetrics serversActive={3} serversTotal={5} />)

      // Assert
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('of 5 total servers')).toBeInTheDocument()
      expect(screen.getByText('60% active')).toBeInTheDocument()
    })

    it('handles zero total servers', () => {
      // Arrange & Act
      render(<UsageMetrics serversActive={0} serversTotal={0} />)

      // Assert
      expect(screen.getByText('of 0 total servers')).toBeInTheDocument()
    })
  })

  describe('Plan Status Display', () => {
    it('displays free plan information', () => {
      // Arrange & Act
      render(<UsageMetrics />)

      // Assert
      expect(screen.getByText('Free')).toBeInTheDocument()
      expect(screen.getByText('Current subscription')).toBeInTheDocument()
      expect(screen.getByText('Upgrade for more requests')).toBeInTheDocument()
    })
  })

  describe('Monthly Summary Display', () => {
    it('displays monthly request count', () => {
      // Arrange & Act
      render(<UsageMetrics requestsUsed={42} />)

      // Assert
      expect(screen.getByText('+42')).toBeInTheDocument()
      expect(screen.getByText('requests made')).toBeInTheDocument()
    })

    it('displays this month card', () => {
      // Arrange & Act
      render(<UsageMetrics requestsUsed={0} />)

      // Assert
      expect(screen.getByText('This Month')).toBeInTheDocument()
      expect(screen.getByText('requests made')).toBeInTheDocument()
    })
  })
})