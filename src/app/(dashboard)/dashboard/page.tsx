import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/db'
import { PRICING_TIERS } from '@/lib/stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Server, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
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
  const currentTier = PRICING_TIERS.find(t => t.id === planId)

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

  const canAddServer = currentTier?.maxServers === -1 || 
    (currentTier?.maxServers && servers.length < currentTier.maxServers)

  return (
    <div className="space-y-6">
      {/* Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge variant="secondary">{currentTier?.name}</Badge>
          </CardTitle>
          <CardDescription>
            {currentTier?.maxServers === -1 ? 'Unlimited custom servers' :
             currentTier?.maxServers === 0 ? 'Built-in servers only' :
             `${servers.length} / ${currentTier?.maxServers} custom servers used`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {currentTier?.maxServers === 0 ? 
                'Upgrade to add custom MCP servers' :
                canAddServer ? 
                  'You can add more servers' : 
                  'Server limit reached'
              }
            </p>
            {planId === 'free' && (
              <Button asChild>
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button asChild disabled={!canAddServer}>
          <Link href="/add-server">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Server
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/settings">
            <Server className="h-4 w-4 mr-2" />
            Manage Billing
          </Link>
        </Button>
      </div>

      {/* Server List */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Your MCP Servers</h2>
        
        {servers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Server className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Custom Servers Yet</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                {currentTier?.maxServers === 0 ? 
                  'Upgrade your plan to add custom MCP servers from GitHub repositories.' :
                  'Add your first custom MCP server to get started.'
                }
              </p>
              {canAddServer && (
                <Button asChild>
                  <Link href="/add-server">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Server
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card key={server.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{server.name}</span>
                    {getStatusIcon(server.status)}
                  </CardTitle>
                  <CardDescription>
                    <Badge className={getStatusColor(server.status)}>
                      {server.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Source:</span> {server.sourceType}
                    </div>
                    {server.sourceUrl && (
                      <div className="text-sm">
                        <span className="font-medium">URL:</span>{' '}
                        <a 
                          href={server.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {server.sourceUrl}
                        </a>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Created {new Date(server.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Built-in Servers */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Built-in MCP Servers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample built-in servers */}
          {[
            {
              name: 'File System',
              description: 'Access and manage local files',
              status: 'active',
            },
            {
              name: 'Web Search',
              description: 'Search the web for information',
              status: 'active',
            },
            {
              name: 'Calculator',
              description: 'Perform mathematical calculations',
              status: 'active',
            },
          ].map((server) => (
            <Card key={server.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{server.name}</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardTitle>
                <CardDescription>{server.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800">
                  Built-in
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}