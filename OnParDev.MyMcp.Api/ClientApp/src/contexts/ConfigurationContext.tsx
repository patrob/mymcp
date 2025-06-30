/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, ReactNode } from 'react'
import { OnParDevMyMcpApiService } from '@/api'

// Type aliases for the generated types
export type ConfigurationResponse = Awaited<ReturnType<typeof OnParDevMyMcpApiService.getConfiguration>>

export interface ConfigurationContextType {
  config: ConfigurationResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined)

interface ConfigurationProviderProps {
  children: ReactNode
}

export function ConfigurationProvider({ children }: ConfigurationProviderProps) {
  const [config, setConfig] = useState<ConfigurationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfiguration = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await OnParDevMyMcpApiService.getConfiguration()
      setConfig(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration')
      console.error('Failed to fetch configuration:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const value: ConfigurationContextType = {
    config,
    isLoading,
    error,
    refetch: fetchConfiguration
  }

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  )
}