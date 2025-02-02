import { DashboardLayout } from "@/components/DashboardLayout"
import { PricingPlans } from "@/components/subscription/PricingPlans"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SubscriptionPage() {
  const { data: profile } = useQuery({
    queryKey: ['business-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          
          {profile?.subscription_tier && profile.subscription_status === 'active' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Current Plan: {profile.subscription_tier}</AlertTitle>
              <AlertDescription>
                Your subscription is active until{' '}
                {new Date(profile.subscription_end_date).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <PricingPlans />
        </div>
      </div>
    </DashboardLayout>
  )
}