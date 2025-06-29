import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { OnParDevMyMcpApiService } from '@/api'

// Type aliases for the generated types
type ConfigurationResponse = Awaited<ReturnType<typeof OnParDevMyMcpApiService.getConfiguration>>

interface ConfigurationContextType {
  config: ConfigurationResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined)

export function useConfiguration() {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider')
  }
  return context
}

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