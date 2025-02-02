import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYFAST_MERCHANT_ID = Deno.env.get('PAYFAST_MERCHANT_ID')
const PAYFAST_MERCHANT_KEY = Deno.env.get('PAYFAST_MERCHANT_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payment_status, m_payment_id, amount_gross, custom_str1, custom_int1 } = await req.json()
    
    console.log('Received PayFast notification:', { 
      payment_status, 
      m_payment_id, 
      amount_gross, 
      custom_str1, // business_id
      custom_int1  // subscription tier (1: basic, 2: pro, 3: enterprise)
    })

    if (!payment_status || !m_payment_id || !amount_gross || !custom_str1) {
      throw new Error('Missing required fields')
    }

    const tierMap = {
      1: 'basic',
      2: 'pro',
      3: 'enterprise'
    }

    const tier = tierMap[custom_int1 as keyof typeof tierMap] || 'basic'
    
    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        business_id: custom_str1,
        payment_id: m_payment_id,
        amount: amount_gross,
        status: payment_status,
        tier: tier,
        payment_date: new Date().toISOString()
      })

    if (subscriptionError) {
      throw subscriptionError
    }

    // Update business profile
    const { error: profileError } = await supabase
      .from('business_profiles')
      .update({
        subscription_tier: tier,
        subscription_status: payment_status === 'COMPLETE' ? 'active' : 'pending',
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        product_limit: tier === 'basic' ? 100 : tier === 'pro' ? 500 : 1000,
        subscription_features: JSON.stringify({
          multiUserAccess: tier !== 'basic',
          advancedAnalytics: tier === 'enterprise',
          prioritySupport: tier !== 'basic',
          apiAccess: tier === 'enterprise',
          customBranding: tier !== 'basic'
        })
      })
      .eq('id', custom_str1)

    if (profileError) {
      throw profileError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing PayFast notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})