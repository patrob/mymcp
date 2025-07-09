import Stripe from 'stripe'
import { PricingTier } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
})

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    maxServers: 0,
    stripePriceId: '',
    popular: true,
    features: [
      'Access to built-in MCP servers',
      'Community support',
      'Basic documentation',
    ],
  },
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'year',
    maxServers: 0,
    stripePriceId: '',
    popular: true,
    features: [
      'Access to built-in MCP servers',
      'Community support',
      'Basic documentation',
    ],
  },
  {
    id: 'dev',
    name: 'Developer',
    price: 14,
    interval: 'month',
    maxServers: 1,
    stripePriceId: process.env.STRIPE_DEV_PRICE_ID || 'price_dev_placeholder',
    comingSoon: true,
    features: [
      'Everything in Free',
      '1 custom MCP server',
      'GitHub integration',
      'Email support',
    ],
  },
  {
    id: 'dev',
    name: 'Developer',
    price: 140,
    interval: 'year',
    maxServers: 1,
    stripePriceId: process.env.STRIPE_DEV_ANNUAL_PRICE_ID || 'price_dev_annual_placeholder',
    comingSoon: true,
    features: [
      'Everything in Free',
      '1 custom MCP server',
      'GitHub integration',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    maxServers: 3,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    comingSoon: true,
    features: [
      'Everything in Developer',
      'Up to 3 custom MCP servers',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 290,
    interval: 'year',
    maxServers: 3,
    stripePriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual_placeholder',
    comingSoon: true,
    features: [
      'Everything in Developer',
      'Up to 3 custom MCP servers',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 140,
    interval: 'month',
    maxServers: -1, // unlimited
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID || 'price_team_placeholder',
    comingSoon: true,
    features: [
      'Everything in Professional',
      'Unlimited custom MCP servers',
      'Team collaboration',
      'Advanced security',
      'Dedicated support',
      'Custom onboarding',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 1400,
    interval: 'year',
    maxServers: -1, // unlimited
    stripePriceId: process.env.STRIPE_TEAM_ANNUAL_PRICE_ID || 'price_team_annual_placeholder',
    comingSoon: true,
    features: [
      'Everything in Professional',
      'Unlimited custom MCP servers',
      'Team collaboration',
      'Advanced security',
      'Dedicated support',
      'Custom onboarding',
    ],
  },
]

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

export async function getStripeCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

export async function getStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

export function getPricingTiersByInterval(interval: 'month' | 'year') {
  return PRICING_TIERS.filter(tier => tier.interval === interval)
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number) {
  const monthlyTotal = monthlyPrice * 12
  const savings = monthlyTotal - annualPrice
  const savingsPercentage = monthlyTotal === 0 ? 0 : Math.round((savings / monthlyTotal) * 100)
  return { savings, savingsPercentage }
}