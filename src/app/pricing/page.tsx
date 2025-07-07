import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRICING_TIERS } from '@/lib/stripe'
import { PricingButton } from '@/components/pricing-button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-gray-500 md:text-lg max-w-2xl mx-auto">
              Start for free and upgrade as you grow. All plans include access to our built-in MCP servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <Card key={tier.id} className={`relative ${tier.popular ? 'border-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${tier.price}</span>
                    {tier.price > 0 && <span className="text-sm">/{tier.interval}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {tier.maxServers === 0 ? 'Built-in servers only' : 
                       tier.maxServers === -1 ? 'Unlimited custom servers' : 
                       `Up to ${tier.maxServers} custom server${tier.maxServers === 1 ? '' : 's'}`}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {tier.id === 'free' ? (
                    <Button asChild className="w-full">
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  ) : tier.id === 'team' ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="mailto:sales@mymcp.online">Contact Sales</Link>
                    </Button>
                  ) : (
                    <PricingButton tier={tier} />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

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

