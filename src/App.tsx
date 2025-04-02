import React, { useEffect, useState, lazy, Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { CartProvider } from "./context/CartContext"
import { TenantProvider } from "@/middleware"

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"))
const AuthPage = lazy(() => import("./pages/AuthPage"))
const Index = lazy(() => import("./pages/Index"))
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"))
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"))
const SubscriptionPage = lazy(() => import("./pages/subscription/Index"))
const BusinessProfileSetupPage = lazy(() => import("./pages/profile/BusinessProfileSetupPage"))
const StorePage = lazy(() => import("./pages/store/StorePage"))
const ProductDetailPage = lazy(() => import("./pages/store/ProductDetailPage"))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    },
  },
})

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <PageLoader />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <TenantProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      !session ? (
                        <LandingPage />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      !session ? (
                        <AuthPage mode="login" />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      session ? <Index /> : <Navigate to="/auth" replace />
                    }
                  />
                  <Route
                    path="/dashboard/profile/setup"
                    element={
                      session ? <BusinessProfileSetupPage /> : <Navigate to="/auth" replace />
                    }
                  />
                  <Route
                    path="/dashboard/subscription"
                    element={
                      session ? <SubscriptionPage /> : <Navigate to="/auth" replace />
                    }
                  />
                  
                  {/* New store routes with the requested URL structure */}
                  <Route path="/shopapp/:businessId" element={<StorePage />} />
                  <Route path="/shopapp/:businessId/product/:productId" element={<ProductDetailPage />} />
                  
                  {/* Redirects from old routes */}
                  <Route path="/:businessId" element={<Navigate to="/shopapp/:businessId" replace />} />
                  <Route path="/:businessId/product/:productId" element={<Navigate to="/shopapp/:businessId/product/:productId" replace />} />
                  <Route path="/store/:businessId" element={<Navigate to="/shopapp/:businessId" replace />} />
                  <Route path="/store/:businessId/product/:productId" element={<Navigate to="/shopapp/:businessId/product/:productId" replace />} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </TenantProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
