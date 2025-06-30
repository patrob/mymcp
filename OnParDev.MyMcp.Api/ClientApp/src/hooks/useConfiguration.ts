import { useContext } from 'react'
import { ConfigurationContext, ConfigurationContextType } from '@/contexts/ConfigurationContext'

export function useConfiguration(): ConfigurationContextType {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider')
  }
  return context
}