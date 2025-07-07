export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  planId: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
}

export type SubscriptionPlan = 'free' | 'dev' | 'pro' | 'team'

export interface MCPServer {
  id: string
  userId: string
  name: string
  sourceType: 'template' | 'github_repo'
  sourceUrl?: string
  config?: Record<string, unknown>
  status: 'active' | 'inactive' | 'error'
  createdAt: Date
  updatedAt: Date
}

export interface PricingTier {
  id: SubscriptionPlan
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  maxServers: number
  stripePriceId: string
  popular?: boolean
}

export interface GitHubRepo {
  name: string
  fullName: string
  url: string
  description?: string
  license?: string
  hasManifest: boolean
}