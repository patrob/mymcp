import { ReactNode } from 'react'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { useConfiguration } from '@/contexts/ConfigurationContext'

interface ProtectedLayoutProps {
  children: ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { config, isLoading, error } = useConfiguration()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Configuration Error</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'Failed to load application configuration'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If authentication is disabled, render children directly
  if (!config.Features?.EnableAuth || !config.Clerk?.PublishableKey) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Development Mode:</strong> Authentication is disabled. 
              Configure Clerk settings to enable authentication.
            </p>
          </div>
          {children}
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider 
      publishableKey={config.Clerk.PublishableKey}
      afterSignOutUrl={config.Clerk.AfterSignOutUrl || "/"}
    >
      <SignedIn>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  )
}