import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const plans = [
  {
    name: "Basic",
    price: "50",
    description: "Perfect for small businesses",
    features: [
      "Up to 100 products",
      "Basic analytics",
      "Email support",
      "Standard features"
    ],
    tier: 1
  },
  {
    name: "Pro",
    price: "250",
    description: "Great for growing businesses",
    features: [
      "Up to 500 products",
      "Advanced analytics",
      "Priority support",
      "Multi-user access",
      "Custom branding"
    ],
    tier: 2
  },
  {
    name: "Enterprise",
    price: "500",
    description: "For large scale operations",
    features: [
      "Unlimited products",
      "Enterprise analytics",
      "24/7 support",
      "API access",
      "Custom solutions",
      "Dedicated account manager"
    ],
    tier: 3
  }
]

export function PricingPlans() {
  const { toast } = useToast()

  const handleSubscribe = async (plan: typeof plans[0]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to subscribe to a plan",
          variant: "destructive"
        })
        return
      }

      // Check if business profile exists
      const { data: profile, error: profileError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error checking business profile:', profileError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify business profile",
        })
        return
      }

      if (!profile) {
        toast({
          variant: "destructive",
          title: "Profile Required",
          description: "Please complete your business profile setup first",
        })
        return
      }

      const businessId = session.user.id
      const timestamp = new Date().getTime()
      const paymentId = `${businessId}_${timestamp}`

      // PayFast payment data
      const data = {
        merchant_id: "11148646",
        merchant_key: "mn3bfi53we6ea",
        return_url: `${window.location.origin}/dashboard`,
        cancel_url: `${window.location.origin}/dashboard`,
        notify_url: `${window.location.origin}/api/handle-payfast`,
        name_first: session.user.email?.split('@')[0] || 'User',
        email_address: session.user.email,
        m_payment_id: paymentId,
        amount: plan.price,
        item_name: `${plan.name} Subscription`,
        custom_str1: businessId,
        custom_int1: plan.tier
      }

      // Create form and submit to PayFast
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://sandbox.payfast.co.za/eng/process'

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value.toString()
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-3xl font-bold mb-4">
              R{plan.price}
              <span className="text-sm font-normal">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(plan)}
            >
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}