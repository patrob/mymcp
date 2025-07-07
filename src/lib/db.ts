import { supabase, supabaseAdmin } from './supabase'
import { User, Subscription, MCPServer, SubscriptionPlan } from '@/types'

export class Database {
  // User operations
  static async createUser(userData: {
    id: string
    email: string
    name?: string
  }): Promise<User | null> {
    // First check if user already exists
    const existingUser = await this.getUser(userData.id)
    if (existingUser) {
      console.log('User already exists, updating instead')
      return await this.updateUser(userData.id, {
        email: userData.email,
        name: userData.name,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  }

  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  }

  // Subscription operations
  static async createSubscription(subscriptionData: {
    userId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    status: Subscription['status']
    planId: SubscriptionPlan
  }): Promise<Subscription | null> {
    // Check if subscription already exists for this user
    const existingSubscription = await this.getSubscription(subscriptionData.userId)
    if (existingSubscription) {
      console.log('Subscription already exists for user, updating instead')
      return await this.updateSubscription(existingSubscription.id, {
        status: subscriptionData.status,
        planId: subscriptionData.planId,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert([{
        user_id: subscriptionData.userId,
        stripe_customer_id: subscriptionData.stripeCustomerId,
        stripe_subscription_id: subscriptionData.stripeSubscriptionId,
        status: subscriptionData.status,
        plan_id: subscriptionData.planId,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }

    return data
  }

  static async getSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }

    return data
  }

  static async updateSubscription(
    subscriptionId: string,
    updates: Partial<Subscription>
  ): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }

    return data
  }

  static async updateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    updates: Partial<Subscription>
  ): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updates)
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }

    return data
  }

  // MCP Server operations
  static async createMCPServer(serverData: {
    userId: string
    name: string
    sourceType: MCPServer['sourceType']
    sourceUrl?: string
    config?: Record<string, unknown>
  }): Promise<MCPServer | null> {
    const { data, error } = await supabase
      .from('mcp_servers')
      .insert([{
        user_id: serverData.userId,
        name: serverData.name,
        source_type: serverData.sourceType,
        source_url: serverData.sourceUrl,
        config: serverData.config || {},
        status: 'inactive',
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating MCP server:', error)
      return null
    }

    return data
  }

  static async getUserMCPServers(userId: string): Promise<MCPServer[]> {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching MCP servers:', error)
      return []
    }

    return data || []
  }

  static async updateMCPServer(
    serverId: string,
    updates: Partial<MCPServer>
  ): Promise<MCPServer | null> {
    const { data, error } = await supabase
      .from('mcp_servers')
      .update(updates)
      .eq('id', serverId)
      .select()
      .single()

    if (error) {
      console.error('Error updating MCP server:', error)
      return null
    }

    return data
  }

  static async deleteMCPServer(serverId: string): Promise<boolean> {
    const { error } = await supabase
      .from('mcp_servers')
      .delete()
      .eq('id', serverId)

    if (error) {
      console.error('Error deleting MCP server:', error)
      return false
    }

    return true
  }

  // Utility functions
  static async getUserWithSubscription(userId: string): Promise<{
    user: User
    subscription: Subscription | null
  } | null> {
    const user = await this.getUser(userId)
    if (!user) return null

    const subscription = await this.getSubscription(userId)

    return { user, subscription }
  }
}