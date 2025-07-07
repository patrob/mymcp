import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Database } from '@/lib/db'
import { PRICING_TIERS } from '@/lib/stripe'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const servers = await Database.getUserMCPServers(userId)
    return NextResponse.json(servers)
  } catch (error) {
    console.error('Error fetching servers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, sourceType, sourceUrl, config } = await request.json()

    if (!name || !sourceType) {
      return NextResponse.json(
        { error: 'Name and source type are required' },
        { status: 400 }
      )
    }

    // Check subscription limits
    const userWithSubscription = await Database.getUserWithSubscription(userId)
    if (!userWithSubscription) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { subscription } = userWithSubscription
    const planId = subscription?.planId || 'free'
    const tier = PRICING_TIERS.find(t => t.id === planId)
    
    if (!tier) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Check if user has reached server limit
    if (tier.maxServers >= 0) {
      const existingServers = await Database.getUserMCPServers(userId)
      if (existingServers.length >= tier.maxServers) {
        return NextResponse.json(
          { error: 'Server limit reached for your plan' },
          { status: 403 }
        )
      }
    }

    const server = await Database.createMCPServer({
      userId,
      name,
      sourceType,
      sourceUrl,
      config,
    })

    if (!server) {
      return NextResponse.json(
        { error: 'Failed to create server' },
        { status: 500 }
      )
    }

    return NextResponse.json(server)
  } catch (error) {
    console.error('Error creating server:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}