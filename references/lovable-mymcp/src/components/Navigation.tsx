
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const { user } = useUser();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/settings') || 
                     location.pathname.startsWith('/add-server');

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">My MCP</span>
            </Link>
            
            <SignedIn>
              {isDashboard && (
                <div className="hidden md:flex items-center space-x-6">
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/dashboard' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/add-server" 
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/add-server' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Add Server
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/settings' 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Settings
                  </Link>
                </div>
              )}
            </SignedIn>
          </div>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName || 'Developer'}
                </span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
