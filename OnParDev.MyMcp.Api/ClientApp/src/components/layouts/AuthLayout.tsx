import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-xl">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="bg-primary rounded-lg p-2">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary">MyMcp</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Build powerful AI integrations
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Deploy and manage MCP (Model Context Protocol) servers with ease. 
            Connect any AI model to your applications using our intuitive platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 rounded-full p-1">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-muted-foreground">Fast deployment in seconds</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 rounded-full p-1">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-muted-foreground">Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 rounded-full p-1">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-muted-foreground">Easy AI model integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-2">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary">MyMcp</span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-8">
            {children}
          </div>

          {/* Back to home link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}