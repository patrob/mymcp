'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPricingTiersByInterval, calculateAnnualSavings } from '@/lib/stripe'
import { PricingButton } from '@/components/pricing-button'
import { BillingPeriodToggle } from '@/components/billing-period-toggle'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly')
  const interval = billingPeriod === 'monthly' ? 'month' : 'year'
  const pricingTiers = getPricingTiersByInterval(interval)
  return (
    <div className="min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">My MCP</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sign-in">
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start for free and upgrade as you grow. All plans include access to our built-in MCP
              servers.
            </p>
            <BillingPeriodToggle
              defaultPeriod={billingPeriod}
              onPeriodChange={setBillingPeriod}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={`${tier.id}-${tier.interval}`}
                className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    {tier.price > 0 && <span className="text-gray-500 ml-1">/{tier.interval}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {tier.maxServers === 0
                        ? 'Built-in servers only'
                        : tier.maxServers === -1
                          ? 'Unlimited custom servers'
                          : `Up to ${tier.maxServers} custom server${tier.maxServers === 1 ? '' : 's'}`}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  {tier.id === 'free' ? (
                    <Button asChild className="w-full">
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  ) : tier.comingSoon ? (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  ) : tier.id === 'team' ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="mailto:sales@mymcp.online">Contact Sales</Link>
                    </Button>
                  ) : (
                    <PricingButton
                      tier={tier}
                      className={`w-full ${tier.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                    />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 My MCP. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
