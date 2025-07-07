import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createPortalSession } from '@/lib/stripe'
import { Database } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await Database.getSubscription(userId)
    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const portal = await createPortalSession({
      customerId: subscription.stripeCustomerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return NextResponse.json(portal)
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}