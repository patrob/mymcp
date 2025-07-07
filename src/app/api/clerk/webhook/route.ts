import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { Database } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headerPayload = headers()
  
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt: any

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = evt

  try {
    switch (type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name } = data
        
        // Create user in our database
        const user = await Database.createUser({
          id,
          email: email_addresses[0]?.email_address || '',
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
        })

        if (!user) {
          console.error('Failed to create user in database')
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        // Create free tier subscription for new user
        await Database.createSubscription({
          userId: id,
          stripeCustomerId: '', // Will be set when they upgrade
          stripeSubscriptionId: '', // Will be set when they upgrade
          status: 'active',
          planId: 'free',
        })

        console.log(`User created: ${id} (${email_addresses[0]?.email_address})`)
        break
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = data
        
        // Update user in our database
        await Database.updateUser(id, {
          email: email_addresses[0]?.email_address || '',
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
        })

        console.log(`User updated: ${id}`)
        break
      }

      case 'user.deleted': {
        const { id } = data
        
        // Note: This will cascade delete subscriptions and servers due to foreign key constraints
        // You might want to implement soft deletion or data retention policies here
        console.log(`User deleted: ${id}`)
        // For now, we'll let the database handle cascade deletion
        break
      }

      default:
        console.log(`Unhandled webhook type: ${type}`)
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