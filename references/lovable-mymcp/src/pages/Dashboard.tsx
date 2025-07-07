
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Server, Settings, ExternalLink, Github } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  
  // Mock data - in real app this would come from Supabase
  const currentPlan = "Free";
  const customServerSlots = { used: 0, total: 0, available: 0 };
  
  const builtInServers = [
    {
      name: "GitHub MCP",
      description: "Connect to GitHub repositories, issues, and pull requests",
      status: "active",
      icon: Github,
      lastUsed: "2 hours ago"
    }
  ];
  
  const customServers = [
    // Empty for free plan
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Developer'}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your MCP Servers and accelerate your AI development workflow
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{currentPlan}</span>
                <Link to="/pricing">
                  <Button variant="outline" size="sm">Upgrade</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Custom Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {customServerSlots.used} / {customServerSlots.total}
                </span>
                {customServerSlots.available > 0 ? (
                  <Link to="/add-server">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </Link>
                ) : (
                  <Link to="/pricing">
                    <Button size="sm" variant="outline">Upgrade</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-900">
                {builtInServers.length + customServers.length}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Built-in Servers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Built-in MCP Servers</h2>
            <Badge variant="secondary">Included in all plans</Badge>
          </div>
          
          <div className="grid gap-4">
            {builtInServers.map((server, index) => {
              const IconComponent = server.icon;
              return (
                <Card key={index} className="transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{server.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{server.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <Badge variant={server.status === 'active' ? 'default' : 'secondary'}>
                              {server.status}
                            </Badge>
                            <span>Last used: {server.lastUsed}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Servers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Custom MCP Servers</h2>
            {currentPlan === 'Free' ? (
              <Link to="/pricing">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upgrade to Add Custom Servers
                </Button>
              </Link>
            ) : (
              <Link to="/add-server">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Server
                </Button>
              </Link>
            )}
          </div>
          
          {customServers.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-12 text-center">
                <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No custom servers yet</h3>
                <p className="text-gray-600 mb-4">
                  {currentPlan === 'Free' 
                    ? 'Upgrade to add custom MCP Servers from templates or GitHub repos'
                    : 'Add your first custom MCP Server from a template or GitHub repo'
                  }
                </p>
                {currentPlan === 'Free' ? (
                  <Link to="/pricing">
                    <Button>View Pricing Plans</Button>
                  </Link>
                ) : (
                  <Link to="/add-server">
                    <Button>Add Your First Server</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Custom servers would be rendered here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
