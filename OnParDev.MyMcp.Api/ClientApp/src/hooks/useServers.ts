import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { McpServersEndpointsService } from '@/api'
import type { ServerInstanceDto, CreateGitHubServerRequest } from '@/api'

export function useServers() {
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => McpServersEndpointsService.getUserMcpServers(),
    staleTime: 30000
  })
}

export function useServer(id: string) {
  return useQuery({
    queryKey: ['servers', id],
    queryFn: () => McpServersEndpointsService.getMcpServer(id),
    enabled: !!id
  })
}

export function useCreateGitHubServer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreateGitHubServerRequest) => 
      McpServersEndpointsService.createGitHubServer(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
    }
  })
}

export function useStartServer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => McpServersEndpointsService.startMcpServer(id),
    onSuccess: (data: ServerInstanceDto) => {
      queryClient.setQueryData(['servers', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['servers'] })
    }
  })
}

export function useStopServer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => McpServersEndpointsService.stopMcpServer(id),
    onSuccess: (data: ServerInstanceDto) => {
      queryClient.setQueryData(['servers', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['servers'] })
    }
  })
}

export function useDeleteServer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => McpServersEndpointsService.deleteMcpServer(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['servers', id] })
      queryClient.invalidateQueries({ queryKey: ['servers'] })
    }
  })
}

export function useServerHealth(id: string) {
  return useQuery({
    queryKey: ['servers', id, 'health'],
    queryFn: () => McpServersEndpointsService.getMcpServerHealth(id),
    enabled: !!id,
    refetchInterval: 30000
  })
}