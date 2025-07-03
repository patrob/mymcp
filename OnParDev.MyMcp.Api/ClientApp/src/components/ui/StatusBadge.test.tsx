import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'
import type { ServerStatus } from '../../api/models/ServerStatus'

describe('StatusBadge', () => {
  describe('Status Display', () => {
    it('displays stopped status correctly', () => {
      // Arrange & Act
      render(<StatusBadge status={0} />)

      // Assert
      expect(screen.getByText('Stopped')).toBeInTheDocument()
    })

    it('displays starting status correctly', () => {
      // Arrange & Act
      render(<StatusBadge status={1} />)

      // Assert
      expect(screen.getByText('Starting')).toBeInTheDocument()
    })

    it('displays running status correctly', () => {
      // Arrange & Act
      render(<StatusBadge status={2} />)

      // Assert
      expect(screen.getByText('Running')).toBeInTheDocument()
    })

    it('displays stopping status correctly', () => {
      // Arrange & Act
      render(<StatusBadge status={3} />)

      // Assert
      expect(screen.getByText('Stopping')).toBeInTheDocument()
    })

    it('displays failed status correctly', () => {
      // Arrange & Act
      render(<StatusBadge status={4} />)

      // Assert
      expect(screen.getByText('Failed')).toBeInTheDocument()
    })

    it('displays unknown status for invalid status', () => {
      // Arrange & Act
      render(<StatusBadge status={99 as ServerStatus} />)

      // Assert
      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies green styling for running status', () => {
      // Arrange & Act
      render(<StatusBadge status={2} />)

      // Assert
      expect(screen.getByText('Running')).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('applies red styling for failed status', () => {
      // Arrange & Act
      render(<StatusBadge status={4} />)

      // Assert
      expect(screen.getByText('Failed')).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('applies custom className when provided', () => {
      // Arrange & Act
      render(<StatusBadge status={2} className="custom-class" />)

      // Assert
      expect(screen.getByText('Running')).toHaveClass('custom-class')
    })
  })
})