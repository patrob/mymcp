
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Access to built-in MCP Servers",
        "GitHub MCP Server included",
        "Basic OAuth management",
        "Community support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Dev",
      price: "$9",
      period: "per month",
      description: "For individual developers",
      features: [
        "Everything in Free",
        "1 custom MCP Server",
        "Template library access",
        "GitHub repo integration",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professional projects",
      features: [
        "Everything in Dev",
        "Up to 3 custom MCP Servers",
        "Advanced monitoring",
        "Custom templates",
        "Dedicated support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Team",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Unlimited MCP Servers",
        "Team collaboration",
        "Enterprise security",
        "Custom integrations",
        "24/7 support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your development needs. Start free, upgrade as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular 
                ? 'border-blue-500 shadow-lg transform scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== "contact us" && (
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <Link to="/dashboard">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Free' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </Link>
                </SignedIn>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All plans include our core MCP Server management features
          </p>
          <p className="text-sm text-gray-500">
            Questions? <a href="mailto:support@mymcp.online" className="text-blue-600 hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
