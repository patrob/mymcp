import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/db'
import { PRICING_TIERS } from '@/lib/stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Server,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Github,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const userWithSubscription = await Database.getUserWithSubscription(userId)
  if (!userWithSubscription) {
    redirect('/sign-in')
  }

  const { subscription } = userWithSubscription
  const servers = await Database.getUserMCPServers(userId)
  const planId = subscription?.planId || 'free'
  const currentTier = PRICING_TIERS.find((t) => t.id === planId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const canAddServer =
    currentTier?.maxServers === -1 ||
    (currentTier?.maxServers && servers.length < currentTier.maxServers)

  // Mock built-in servers for demo
  const builtInServers = [
    {
      name: 'GitHub MCP',
      description: 'Connect to GitHub repositories, issues, and pull requests',
      status: 'active',
      icon: Github,
      lastUsed: '2 hours ago',
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Developer! 👋</h1>
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
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentTier?.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentTier?.maxServers === -1
                      ? 'Unlimited servers'
                      : currentTier?.maxServers === 0
                        ? 'Built-in only'
                        : `${servers.length}/${currentTier?.maxServers} servers`}
                  </p>
                </div>
                {planId === 'free' && (
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Link href="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {servers.filter((s) => s.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-500">Running now</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{servers.length}</p>
                  <p className="text-sm text-gray-500">Configured</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            asChild
            disabled={!canAddServer}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/add-server">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Server
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Manage Billing
            </Link>
          </Button>
        </div>

        {/* Built-in Servers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Built-in Servers</h2>
          <div className="grid gap-4">
            {builtInServers.map((server) => (
              <Card key={server.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <server.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                        <p className="text-gray-600 mb-2">{server.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Last used: {server.lastUsed}</span>
                          <Badge className={getStatusColor(server.status)}>
                            {getStatusIcon(server.status)}
                            <span className="ml-1">{server.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Servers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Custom Servers</h2>
            <span className="text-sm text-gray-500">
              {servers.length} {servers.length === 1 ? 'server' : 'servers'}
            </span>
          </div>

          {servers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No custom servers yet</h3>
                <p className="text-gray-600 mb-4">
                  {currentTier?.maxServers === 0
                    ? 'Upgrade your plan to add custom MCP servers'
                    : 'Add your first custom MCP server to get started'}
                </p>
                {canAddServer && (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Link href="/add-server">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Server
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {servers.map((server) => (
                <Card key={server.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                          <p className="text-gray-600 mb-2">Custom MCP Server</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {new Date(server.createdAt).toLocaleDateString()}</span>
                            <Badge className={getStatusColor(server.status)}>
                              {getStatusIcon(server.status)}
                              <span className="ml-1">{server.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
