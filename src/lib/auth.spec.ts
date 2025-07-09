import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUserId, getCurrentUser } from './auth'

// Mock the Clerk auth function
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

describe('Auth Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUserId', () => {
    it('should return userId when auth is successful', async () => {
      const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth
      mockAuth.mockResolvedValue({ userId: 'user_123' })

      const result = await getCurrentUserId()

      expect(result).toBe('user_123')
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('should return null when auth throws an error', async () => {
      const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth
      mockAuth.mockRejectedValue(new Error('Auth failed'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await getCurrentUserId()

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error getting current user ID:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('should return null when userId is null', async () => {
      const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth
      mockAuth.mockResolvedValue({ userId: null })

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return auth result when successful', async () => {
      const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth
      const mockAuthResult = { userId: 'user_123', user: { id: 'user_123', email: 'test@example.com' } }
      mockAuth.mockResolvedValue(mockAuthResult)

      const result = await getCurrentUser()

      expect(result).toEqual(mockAuthResult)
      expect(mockAuth).toHaveBeenCalledOnce()
    })

    it('should return null user data when auth fails', async () => {
      const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth
      mockAuth.mockRejectedValue(new Error('Auth failed'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await getCurrentUser()

      expect(result).toEqual({ userId: null, user: null })
      expect(consoleSpy).toHaveBeenCalledWith('Error getting current user:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})