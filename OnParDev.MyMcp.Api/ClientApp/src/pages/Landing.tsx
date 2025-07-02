import { PublicLayout } from '@/components/layouts/PublicLayout'

export default function Landing() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-6" data-testid="hero-icon">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Host. Connect. Scale.
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-violet-600 dark:text-violet-400">
              Powered by MCP.
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your gateway to hosted MCP servers. Connect your AI applications to powerful data sources and tools with zero infrastructure hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/sign-up"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free
              </a>
              <a 
                href="#features"
                className="border-2 border-slate-300 dark:border-slate-600 hover:border-violet-500 dark:hover:border-violet-400 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Starting Features Section */}
          <div id="features" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Starting Features
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Everything you need to get started with hosted MCP servers
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6" data-testid="feature-icon">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Hosted MCP Servers</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Access pre-configured MCP servers including GitHub integration. No setup required - just connect and start building.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6" data-testid="feature-icon">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Free Tier Access</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get started with 100 requests per month completely free. Perfect for testing and small projects.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6" data-testid="feature-icon">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Instant Connection</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Connect your AI applications in minutes with our simple authentication and connection process.
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Upcoming Features
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Exciting capabilities coming soon to expand your MCP possibilities
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-2xl p-8 border-2 border-dashed border-violet-200 dark:border-violet-800">
                <div className="bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800/50 dark:to-purple-800/50 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6" data-testid="upcoming-feature-icon">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">MCP Marketplace</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Browse and deploy community-created MCP servers for databases, APIs, and specialized tools.
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-2xl p-8 border-2 border-dashed border-violet-200 dark:border-violet-800">
                <div className="bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800/50 dark:to-purple-800/50 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6" data-testid="upcoming-feature-icon">
                  <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Custom Server Deployment</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Deploy your own MCP servers from GitHub repositories with automated security scanning and hosting.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
              Join the growing community of developers building the future of AI integrations with MCP.
            </p>
            <a 
              href="/sign-up"
              className="bg-white text-violet-600 px-10 py-4 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
            >
              Start Building Today
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}