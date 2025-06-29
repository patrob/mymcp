import { UserButton } from '@clerk/clerk-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Server, Play, Square } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">OnParDev MyMcp</h1>
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Server Instances</h2>
            <p className="text-muted-foreground">
              Manage your MCP server instances
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Server
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample server cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sample Server 1
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Running</div>
              <p className="text-xs text-muted-foreground">
                Started 2 hours ago
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Square className="h-3 w-3 mr-1" />
                  Stop
                </Button>
                <Button size="sm" variant="outline">
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sample Server 2
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">Stopped</div>
              <p className="text-xs text-muted-foreground">
                Last run 1 day ago
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm">
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Create New Server</CardTitle>
              <CardDescription>
                Deploy a new MCP server instance from a template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}