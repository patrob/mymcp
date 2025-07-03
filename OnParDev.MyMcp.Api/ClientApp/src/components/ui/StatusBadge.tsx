import { cn } from '@/lib/utils'
import type { ServerStatus } from '@/api'

interface StatusBadgeProps {
  status: ServerStatus
  className?: string
}

const statusConfig = {
  0: { label: 'Stopped', className: 'bg-gray-100 text-gray-800' },
  1: { label: 'Starting', className: 'bg-yellow-100 text-yellow-800' },
  2: { label: 'Running', className: 'bg-green-100 text-green-800' },
  3: { label: 'Stopping', className: 'bg-orange-100 text-orange-800' },
  4: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  5: { label: 'Unknown', className: 'bg-gray-100 text-gray-800' }
} as const

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[5]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}