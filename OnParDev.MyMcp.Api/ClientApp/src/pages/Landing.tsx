import { PublicLayout } from '@/components/layouts/PublicLayout'

export default function Landing() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">MyMcp</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage and deploy MCP (Model Context Protocol) servers with ease. 
            Build powerful AI integrations with our intuitive platform.
          </p>
          <div className="space-x-4">
            <a 
              href="/dashboard"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 inline-block"
            >
              Get Started
            </a>
            <a 
              href="#features"
              className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent inline-block"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Deployment</h3>
            <p className="text-muted-foreground">
              Deploy MCP servers in seconds with our streamlined container-based approach.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with isolated containers and comprehensive monitoring.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
            <p className="text-muted-foreground">
              Connect with any AI model or application using standard MCP protocols.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of developers building the future of AI integrations.
          </p>
          <a 
            href="/dashboard"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 inline-block"
          >
            Start Building Today
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}