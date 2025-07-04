import { ReactNode, useEffect, useState } from 'react'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useConfiguration } from '@/hooks/useConfiguration'

// Type for test state
declare global {
  interface Window {
    __CLERK_TEST_STATE?: {
      isSignedIn: boolean
      isLoaded: boolean
      user?: {
        id: string
        primaryEmailAddress?: { emailAddress: string }
      }
    }
    __CLERK_MOCK_MODE?: boolean
  }
}

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { config, isLoading } = useConfiguration()
  const [testState, setTestState] = useState<typeof window.__CLERK_TEST_STATE | null>(null)
  
  // Check for test mode
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__CLERK_MOCK_MODE) {
      setTestState(window.__CLERK_TEST_STATE || null)
    }
  }, [])

  const Navigation = () => (
    <nav className="flex items-center justify-between">
      <div className="text-xl font-bold">
        MyMcp
      </div>
      <div className="flex items-center space-x-4">
        <a href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </a>
        {config?.features?.enableAuth && config.clerk?.publishableKey ? (
          testState ? (
            // Test mode - render based on test state
            testState.isSignedIn ? (
              <>
                <a 
                  href="/dashboard" 
                  data-testid="dashboard-link-authenticated"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </a>
                <div data-testid="user-button">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                    {testState.user?.primaryEmailAddress?.emailAddress || 'User'}
                  </button>
                </div>
              </>
            ) : (
              <button 
                data-testid="sign-in-button"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Sign In
              </button>
            )
          ) : (
            // Production mode - use real Clerk components
            <>
              <SignedOut>
                <SignInButton mode="modal" data-testid="sign-in-button">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <a 
                  href="/dashboard" 
                  data-testid="dashboard-link-authenticated"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </a>
                <div data-testid="user-button">
                  <UserButton afterSignOutUrl={config.clerk.afterSignOutUrl || "/"} />
                </div>
              </SignedIn>
            </>
          )
        ) : (
          <a 
            href="/dashboard" 
            data-testid="dashboard-link-unauthenticated"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Dashboard
          </a>
        )}
      </div>
    </nav>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="text-xl font-bold">MyMcp</div>
              <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>
    )
  }

  const content = (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Navigation />
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} On PAR Dev, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )

  // If auth is enabled and we have a publishable key, wrap with ClerkProvider
  if (config?.features?.enableAuth && config.clerk?.publishableKey) {
    return (
      <ClerkProvider 
        publishableKey={config.clerk.publishableKey}
        afterSignOutUrl={config.clerk.afterSignOutUrl || "/"}
      >
        {content}
      </ClerkProvider>
    )
  }

  // Otherwise, render without Clerk
  return content
}