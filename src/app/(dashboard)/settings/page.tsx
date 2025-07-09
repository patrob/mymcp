import { getCurrentUser } from '@/lib/auth'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/db'
import { PRICING_TIERS } from '@/lib/stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BillingPortalButton } from '@/components/billing-portal-button'
import { User, CreditCard, Settings } from 'lucide-react'

export default async function SettingsPage() {
  const { userId } = await getCurrentUser()
  
  if (!userId) {
    redirect('/sign-in')
  }

  let user
  let userWithSubscription
  
  try {
    user = await currentUser()
    userWithSubscription = await Database.getUserWithSubscription(userId)
    
    if (!userWithSubscription) {
      console.log('User not found in database, redirecting to sign-in')
      redirect('/sign-in')
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    redirect('/sign-in')
  }

  const { subscription } = userWithSubscription
  const planId = subscription?.planId || 'free'
  const currentTier = PRICING_TIERS.find(t => t.id === planId)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and subscription settings.
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-sm text-gray-900 mt-1">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900 mt-1">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Member Since</label>
            <p className="text-sm text-gray-900 mt-1">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your billing and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                Current Plan
                <Badge variant="secondary">{currentTier?.name}</Badge>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentTier?.price === 0 ? 'Free forever' : 
                 `$${currentTier?.price}/${currentTier?.interval}`}
              </p>
            </div>
            <div className="flex gap-2">
              {planId === 'free' ? (
                <Button asChild>
                  <a href="/pricing">Upgrade Plan</a>
                </Button>
              ) : (
                <BillingPortalButton />
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Plan Features</h4>
            <ul className="space-y-1">
              {currentTier?.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              <strong>Server Limit:</strong>{' '}
              {currentTier?.maxServers === -1 ? 'Unlimited' :
               currentTier?.maxServers === 0 ? 'Built-in servers only' :
               `${currentTier?.maxServers} custom server${currentTier?.maxServers === 1 ? '' : 's'}`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
          <CardDescription>
            Manage your account settings and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-gray-600">
                  Download a copy of your account data and server configurations.
                </p>
              </div>
              <Button variant="outline" disabled>
                Export (Coming Soon)
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

