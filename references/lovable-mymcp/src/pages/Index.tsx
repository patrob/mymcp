
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Shield, Zap, Github, Server, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium mb-6">
                <Server className="w-4 h-4 mr-2" />
                Model Context Protocol Servers
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Automate. Engage. Convert.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your journey to AI-powered development starts here. Access secure, pre-built MCP Servers or deploy your own from templates and GitHub repos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </SignedIn>
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build with MCP
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simplify AI agent integration with secure, scalable MCP Server management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Setup</h3>
                <p className="text-gray-600">
                  Deploy MCP Servers in minutes with our pre-built templates or connect your GitHub repos seamlessly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Secure by Default</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with OAuth token management and encrypted credential storage.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scale Effortlessly</h3>
                <p className="text-gray-600">
                  From free tier to team deployments, scale your MCP Server infrastructure as you grow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to accelerate your AI development?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the future with MCP Servers
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                Start Building Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
};

export default Index;
