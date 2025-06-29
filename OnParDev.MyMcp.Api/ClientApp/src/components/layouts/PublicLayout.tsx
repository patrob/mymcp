import { ReactNode } from 'react'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold">
              MyMcp
            </div>
            <div className="space-x-4">
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </a>
              <a href="/dashboard" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Sign In
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2024 MyMcp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}