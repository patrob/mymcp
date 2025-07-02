import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ServerActionsMenu } from './ServerActionsMenu'
import { Server } from 'lucide-react'
import type { ServerInstanceDto } from '@/api'

interface ServerCardProps {
  server: ServerInstanceDto
  onAction?: (action: string, serverId: string) => void
}

export function ServerCard({ server, onAction }: ServerCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getLastActivityTime = () => {
    if (server.status === 2 && server.lastStartedAt) {
      return `Started ${formatDate(server.lastStartedAt)}`
    }
    if (server.lastStoppedAt) {
      return `Last run ${formatDate(server.lastStoppedAt)}`
    }
    return `Created ${formatDate(server.createdAt)}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium truncate">
          {server.name}
        </CardTitle>
        <Server className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <StatusBadge status={server.status} />
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {getLastActivityTime()}
        </p>
        {server.description && (
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
            {server.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground mb-4">
          <div>Template: {server.template.name}</div>
          <div>Version: {server.template.version}</div>
        </div>
        <ServerActionsMenu 
          server={server} 
          onAction={onAction}
        />
      </CardContent>
    </Card>
  )
}