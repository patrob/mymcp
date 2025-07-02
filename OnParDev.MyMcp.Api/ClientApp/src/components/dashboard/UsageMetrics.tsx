import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, Server, TrendingUp } from 'lucide-react'

interface UsageMetricsProps {
  requestsUsed?: number
  requestsLimit?: number
  serversActive?: number
  serversTotal?: number
}

export function UsageMetrics({
  requestsUsed = 0,
  requestsLimit = 100,
  serversActive = 0,
  serversTotal = 0
}: UsageMetricsProps) {
  const requestsPercentage = (requestsUsed / requestsLimit) * 100
  const serversPercentage = serversTotal > 0 ? (serversActive / serversTotal) * 100 : 0

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Requests</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requestsUsed.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            of {requestsLimit.toLocaleString()} this month
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                requestsPercentage >= 90 ? 'bg-red-500' :
                requestsPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(requestsPercentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{serversActive}</div>
          <p className="text-xs text-muted-foreground">
            of {serversTotal} total servers
          </p>
          {serversTotal > 0 && (
            <p className={`text-xs ${getUsageColor(serversPercentage)}`}>
              {serversPercentage.toFixed(0)}% active
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Free</div>
          <p className="text-xs text-muted-foreground">
            Current subscription
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Upgrade for more requests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requestsUsed > 0 ? '+' : ''}{requestsUsed}
          </div>
          <p className="text-xs text-muted-foreground">
            requests made
          </p>
          <p className="text-xs text-green-600 mt-1">
            {requestsLimit - requestsUsed} remaining
          </p>
        </CardContent>
      </Card>
    </div>
  )
}