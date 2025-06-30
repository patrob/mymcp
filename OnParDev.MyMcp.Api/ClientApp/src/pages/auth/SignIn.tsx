import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { useConfiguration } from '@/contexts/ConfigurationContext'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Link } from 'react-router-dom'

export default function SignIn() {
  const { config, isLoading, error } = useConfiguration()

  if (isLoading) {
    return (
      <AuthLayout title="Welcome back" subtitle="Signing you in...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    )
  }

  if (error || !config) {
    return (
      <AuthLayout title="Configuration Error" subtitle="We're having trouble loading the application">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">
            {error || 'Failed to load application configuration'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </AuthLayout>
    )
  }

  // If authentication is disabled, show configuration message
  if (!config.features?.enableAuth || !config.clerk?.publishableKey) {
    return (
      <AuthLayout title="Authentication Not Configured" subtitle="Authentication is currently disabled">
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Development Mode:</strong> Authentication is disabled. 
              Configure Clerk settings to enable sign-in functionality.
            </p>
          </div>
          <Link 
            to="/dashboard"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 inline-block"
          >
            Continue to Dashboard
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue building"
    >
      <ClerkSignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            card: 'shadow-none',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'border border-border hover:bg-accent',
            formFieldInput: 'border border-border focus:ring-primary',
            footerActionLink: 'text-primary hover:text-primary/80'
          }
        }}
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-primary hover:text-primary/80 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}