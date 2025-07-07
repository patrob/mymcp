
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, FileText, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddServer = () => {
  const [serverName, setServerName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const templates = [
    {
      name: "GitHub MCP Server",
      description: "Connect to GitHub repositories, issues, and pull requests",
      icon: Github,
      features: ["Repository access", "Issue tracking", "PR management"],
      difficulty: "Easy",
      estimatedTime: "5 minutes"
    }
  ];

  const handleValidateRepo = async () => {
    if (!repoUrl) return;
    
    setIsValidating(true);
    // Mock validation - in real app this would check for .well-known/mcp-server.json
    setTimeout(() => {
      setIsValidating(false);
      toast({
        title: "Repository validated",
        description: "MCP Server configuration found. Ready to deploy!",
      });
    }, 2000);
  };

  const handleCreateServer = () => {
    toast({
      title: "Server created successfully!",
      description: "Your MCP Server is being deployed and will be available shortly.",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add MCP Server</h1>
          <p className="text-gray-600">
            Deploy a new MCP Server from a template or your own GitHub repository
          </p>
        </div>

        <Tabs defaultValue="template" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              From Template
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center">
              <Github className="w-4 h-4 mr-2" />
              From GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Template</h2>
              <div className="grid gap-4">
                {templates.map((template, index) => {
                  const IconComponent = template.icon;
                  return (
                    <Card key={index} className="cursor-pointer transition-all duration-200 hover:shadow-md border-2 hover:border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                              <p className="text-gray-600 mb-3">{template.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {template.features.map((feature, featureIndex) => (
                                  <Badge key={featureIndex} variant="secondary">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Difficulty: {template.difficulty}</span>
                                <span>Setup: {template.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          <Button>
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="github" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deploy from GitHub Repository</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      placeholder="My Custom MCP Server"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="repoUrl"
                        placeholder="https://github.com/username/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleValidateRepo}
                        disabled={!repoUrl || isValidating}
                      >
                        {isValidating ? "Validating..." : "Validate"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      We'll check for a valid MCP Server configuration
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this MCP Server does..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Repository Requirements</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Must contain a valid MCP Server implementation</li>
                        <li>• Should include <code className="bg-blue-100 px-1 rounded">.well-known/mcp-server.json</code> configuration</li>
                        <li>• Repository must be public or accessible with your GitHub token</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Link to="/dashboard">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button 
                    onClick={handleCreateServer}
                    disabled={!serverName || !repoUrl}
                  >
                    Create Server
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddServer;
