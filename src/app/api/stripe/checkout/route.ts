import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createCheckoutSession, PRICING_TIERS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, interval } = await request.json()

    if (!planId || !interval) {
      return NextResponse.json({ error: 'Plan ID and interval are required' }, { status: 400 })
    }

    const tier = PRICING_TIERS.find(t => t.id === planId && t.interval === interval)
    if (!tier || tier.id === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const user = await fetch(`${process.env.CLERK_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json())

    const session = await createCheckoutSession({
      priceId: tier.stripePriceId,
      userId,
      userEmail: user.email_addresses[0].email_address,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}