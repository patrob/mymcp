
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ExternalLink, User, CreditCard, Shield, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { user } = useUser();
  
  // Mock data - in real app this would come from Supabase
  const currentPlan = "Free";
  const billingEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and billing information
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900 mt-1">
                    {user?.fullName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">
                    {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900 mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <Separator />
              <p className="text-sm text-gray-600">
                Account details are managed through your authentication provider. 
                To update your information, please use your profile settings.
              </p>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">Current Plan</span>
                    <Badge variant={currentPlan === 'Free' ? 'secondary' : 'default'}>
                      {currentPlan}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {currentPlan === 'Free' 
                      ? 'Access to built-in MCP Servers only'
                      : `Includes ${currentPlan === 'Dev' ? '1' : currentPlan === 'Pro' ? '3' : 'unlimited'} custom MCP Server${currentPlan === 'Dev' ? '' : 's'}`
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  {currentPlan === 'Free' ? (
                    <Link to="/pricing">
                      <Button>Upgrade Plan</Button>
                    </Link>
                  ) : (
                    <>
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Billing Portal
                      </Button>
                      <Link to="/pricing">
                        <Button variant="outline">Change Plan</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              {currentPlan !== 'Free' && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Billing Email</label>
                    <p className="text-gray-900 mt-1">{billingEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Next Billing Date</label>
                    <p className="text-gray-900 mt-1">January 15, 2025</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">OAuth Connections</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your connected OAuth tokens for MCP Servers
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">GitHub</span>
                      <p className="text-sm text-gray-600">Connected for GitHub MCP Server</p>
                    </div>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">MCP Server Credentials</h4>
                <p className="text-sm text-gray-600 mb-4">
                  All credentials are encrypted and stored securely
                </p>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Manage Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
