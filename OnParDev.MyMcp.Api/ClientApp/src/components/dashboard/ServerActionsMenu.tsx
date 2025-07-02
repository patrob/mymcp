import { Button } from '@/components/ui/button'
import { useStartServer, useStopServer, useDeleteServer } from '@/hooks/useServers'
import { Play, Square, Trash2, Settings } from 'lucide-react'
import type { ServerInstanceDto } from '@/api'

interface ServerActionsMenuProps {
  server: ServerInstanceDto
  onAction?: (action: string, serverId: string) => void
}

export function ServerActionsMenu({ server, onAction }: ServerActionsMenuProps) {
  const startMutation = useStartServer()
  const stopMutation = useStopServer()
  const deleteMutation = useDeleteServer()

  const handleStart = () => {
    startMutation.mutate(server.id)
    onAction?.('start', server.id)
  }

  const handleStop = () => {
    stopMutation.mutate(server.id)
    onAction?.('stop', server.id)
  }

  const handleDelete = () => {
    if (confirm(`Delete ${server.name}?`)) {
      deleteMutation.mutate(server.id)
      onAction?.('delete', server.id)
    }
  }

  const isRunning = server.status === 2
  const isStopped = server.status === 0
  const isTransitioning = server.status === 1 || server.status === 3

  return (
    <div className="flex gap-2">
      {isStopped && (
        <Button
          size="sm"
          onClick={handleStart}
          disabled={startMutation.isPending}
        >
          <Play className="h-3 w-3 mr-1" />
          Start
        </Button>
      )}
      
      {isRunning && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleStop}
          disabled={stopMutation.isPending}
        >
          <Square className="h-3 w-3 mr-1" />
          Stop
        </Button>
      )}

      {isTransitioning && (
        <Button size="sm" disabled>
          {server.status === 1 ? 'Starting...' : 'Stopping...'}
        </Button>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => onAction?.('configure', server.id)}
      >
        <Settings className="h-3 w-3 mr-1" />
        Config
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  )
}