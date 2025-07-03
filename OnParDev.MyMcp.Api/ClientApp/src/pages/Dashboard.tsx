import { UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { useServers } from '@/hooks/useServers'
import { ServerCard } from '@/components/dashboard/ServerCard'
import { ServerConnectionWizard } from '@/components/dashboard/ServerConnectionWizard'
import { UsageMetrics } from '@/components/dashboard/UsageMetrics'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { data: servers, isLoading, error, refetch } = useServers()

  const handleServerAction = (action: string, _serverId: string) => {
    if (action === 'configure') {
      // Future implementation
    }
  }

  const handleServerCreated = () => {
    refetch()
  }

  const runningServers = servers?.filter(server => server.status === 2).length || 0
  const totalServers = servers?.length || 0

  if (error) {
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
          <div className="flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Servers</h2>
              <p className="text-muted-foreground mb-4">
                Failed to load your server instances
              </p>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
        </div>

        <UsageMetrics
          serversActive={runningServers}
          serversTotal={totalServers}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading servers...</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers?.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onAction={handleServerAction}
              />
            ))}
            
            <ServerConnectionWizard onServerCreated={handleServerCreated} />
          </div>
        )}

        {!isLoading && servers?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No servers yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first MCP server to get started
            </p>
          </div>
        )}
      </main>
    </div>
  )
}