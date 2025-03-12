
import React, { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import Index from "./pages/Index"
import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/AuthPage"
import PrivacyPolicy from "./pages/legal/PrivacyPolicy"
import TermsOfService from "./pages/legal/TermsOfService"
import SubscriptionPage from "./pages/subscription/Index"
import { BusinessProfileSetup } from "./components/profile/BusinessProfileSetup"
import StorePage from "./pages/store/StorePage"
import ProductDetailPage from "./pages/store/ProductDetailPage"
import ViewStorePage from "./pages/dashboard/ViewStorePage"
import { CartProvider } from "./context/CartContext"

const queryClient = new QueryClient()

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
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                  session ? <BusinessProfileSetup /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/dashboard/subscription"
                element={
                  session ? <SubscriptionPage /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/dashboard/view-store"
                element={
                  session ? <ViewStorePage /> : <Navigate to="/auth" replace />
                }
              />
              
              {/* Store Routes - These are public facing */}
              <Route path="/store/:businessId" element={<StorePage />} />
              <Route path="/store/:businessId/product/:productId" element={<ProductDetailPage />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
