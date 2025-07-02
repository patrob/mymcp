import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useServers, useCreateGitHubServer, useStartServer } from './useServers'
import { McpServersEndpointsService, type ServerInstanceDto, type CreateGitHubServerRequest } from '@/api'

vi.mock('@/api', () => ({
  McpServersEndpointsService: {
    getUserMcpServers: vi.fn(),
    createGitHubServer: vi.fn(),
    startMcpServer: vi.fn()
  }
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockServer: ServerInstanceDto = {
  id: '123',
  name: 'Test Server',
  status: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  template: {
    id: '456',
    name: 'GitHub Template',
    version: '1.0.0',
    category: 'Source Control',
    isOfficial: true
  }
}

describe('useServers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useServers hook', () => {
    it('fetches servers successfully', async () => {
      // Arrange
      const mockServers = [mockServer]
      vi.mocked(McpServersEndpointsService.getUserMcpServers).mockResolvedValue(mockServers)

      // Act
      const { result } = renderHook(() => useServers(), { wrapper: createWrapper() })

      // Assert
      await waitFor(() => {
        expect(result.current.data).toEqual(mockServers)
      })
    })

    it('handles fetch error', async () => {
      // Arrange
      vi.mocked(McpServersEndpointsService.getUserMcpServers).mockRejectedValue(new Error('API Error'))

      // Act
      const { result } = renderHook(() => useServers(), { wrapper: createWrapper() })

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })
    })
  })

  describe('useCreateGitHubServer hook', () => {
    it('creates server successfully', async () => {
      // Arrange
      const request: CreateGitHubServerRequest = {
        name: 'New Server',
        description: 'Test',
        repositoryUrl: 'https://github.com/test/repo',
        accessToken: 'token'
      }
      vi.mocked(McpServersEndpointsService.createGitHubServer).mockResolvedValue(mockServer)

      // Act
      const { result } = renderHook(() => useCreateGitHubServer(), { wrapper: createWrapper() })
      result.current.mutate(request)

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useStartServer hook', () => {
    it('starts server successfully', async () => {
      // Arrange
      const runningServer = { ...mockServer, status: 2 }
      vi.mocked(McpServersEndpointsService.startMcpServer).mockResolvedValue(runningServer)

      // Act
      const { result } = renderHook(() => useStartServer(), { wrapper: createWrapper() })
      result.current.mutate('123')

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})