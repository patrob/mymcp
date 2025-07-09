import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { Database } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId || !customerId || !subscriptionId) {
          console.error('Missing required session data')
          break
        }

        // Retrieve subscription to get plan details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id

        // Map price ID to plan ID
        const planId = getPlanIdFromPriceId(priceId)

        if (!planId) {
          console.error('Unknown price ID:', priceId)
          break
        }

        // Create subscription record
        await Database.createSubscription({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          planId,
        })

        // Ensure user exists
        const user = await Database.getUser(userId)
        if (!user) {
          // Get user data from Clerk
          const clerkUser = await fetch(`${process.env.CLERK_API_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          }).then(res => res.json())

          await Database.createUser({
            id: userId,
            email: clerkUser.email_addresses[0].email_address,
            name: clerkUser.first_name + ' ' + clerkUser.last_name,
          })
        }

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          await Database.updateSubscriptionByStripeId(subscriptionId, {
            status: 'active',
          })
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          await Database.updateSubscriptionByStripeId(subscriptionId, {
            status: 'past_due',
          })
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        await Database.updateSubscriptionByStripeId(subscriptionId, {
          status: 'canceled',
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function getPlanIdFromPriceId(priceId: string): 'dev' | 'pro' | 'team' | null {
  const priceMap: Record<string, 'dev' | 'pro' | 'team'> = {
    // Monthly price IDs
    [process.env.STRIPE_DEV_PRICE_ID || 'price_dev_placeholder']: 'dev',
    [process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder']: 'pro',
    [process.env.STRIPE_TEAM_PRICE_ID || 'price_team_placeholder']: 'team',
    // Annual price IDs
    [process.env.STRIPE_DEV_ANNUAL_PRICE_ID || 'price_dev_annual_placeholder']: 'dev',
    [process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual_placeholder']: 'pro',
    [process.env.STRIPE_TEAM_ANNUAL_PRICE_ID || 'price_team_annual_placeholder']: 'team',
  }

  return priceMap[priceId] || null
}