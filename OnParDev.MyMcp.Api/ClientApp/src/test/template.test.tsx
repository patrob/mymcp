// TEST TEMPLATE - Copy this structure for new test files
// Delete this file after copying the template

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock external dependencies
vi.mock('@/some/dependency', () => ({
  useSomething: vi.fn()
}))

const mockUseSomething = vi.fn()

// Helper function for test data creation
const createMockData = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test Name',
  isActive: true,
  ...overrides
})

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Feature Group Name', () => {
    it('describes what it should do in specific terms', () => {
      // Arrange
      const testData = createMockData({ name: 'Specific Test Data' })
      mockUseSomething.mockReturnValue(testData)

      // Act
      render(<ComponentName prop={testData} />)

      // Assert
      expect(screen.getByText('Specific Test Data')).toBeInTheDocument()
    })

    it('handles edge case behavior', () => {
      // Arrange
      const emptyData = createMockData({ name: '', isActive: false })
      mockUseSomething.mockReturnValue(emptyData)

      // Act
      render(<ComponentName prop={emptyData} />)

      // Assert
      expect(screen.queryByText('Test Name')).not.toBeInTheDocument()
    })

    it('responds to user interaction', async () => {
      // Arrange
      const user = userEvent.setup()
      const testData = createMockData()
      mockUseSomething.mockReturnValue(testData)

      // Act
      render(<ComponentName prop={testData} />)
      await user.click(screen.getByRole('button', { name: /click me/i }))

      // Assert
      expect(mockUseSomething).toHaveBeenCalledWith('expected-parameter')
    })
  })

  describe('Another Feature Group', () => {
    it('tests another specific behavior', () => {
      // Arrange
      const specialData = createMockData({ isActive: false })
      mockUseSomething.mockReturnValue(specialData)

      // Act
      render(<ComponentName prop={specialData} />)

      // Assert
      expect(screen.getByTestId('inactive-state')).toBeInTheDocument()
    })
  })
})

/* 
TESTING STANDARDS CHECKLIST:
✅ Each test method is 10 or fewer lines
✅ Each test has 3 or fewer assertions  
✅ Arrange, Act, Assert pattern with comments
✅ No duplication between tests
✅ Descriptive test names using "should" behavior
✅ Mock external dependencies
✅ Use helper functions for test data creation
✅ Group related tests in describe blocks
✅ Clean up mocks in beforeEach
✅ Test both positive and negative cases
✅ Test user interactions when applicable
*/