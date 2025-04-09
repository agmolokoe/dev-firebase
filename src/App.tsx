
import React, { useEffect, useState, lazy, Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { CartProvider } from "./context/CartContext"
import { TenantProvider } from "@/middleware"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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
    <LoadingSpinner size="lg" />
  </div>
)

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setAuthenticated(true);
        } else {
          // Only redirect if not already on the auth page
          if (location.pathname !== '/auth') {
            // Preserve the original URL the user was trying to access
            const returnPath = encodeURIComponent(location.pathname + location.search);
            navigate(`/auth?returnTo=${returnPath}`, { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Only redirect if not already on the auth page
        if (location.pathname !== '/auth') {
          navigate("/auth", { replace: true });
        }
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (checking) {
    return <PageLoader />;
  }

  return authenticated ? <>{children}</> : null;
};

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
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
                  
                  {/* Protected routes - will redirect to auth if not logged in */}
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/profile/setup"
                    element={
                      <ProtectedRoute>
                        <BusinessProfileSetupPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/subscription"
                    element={
                      <ProtectedRoute>
                        <SubscriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Public store routes - can be accessed without auth */}
                  <Route path="/shopapp/:businessId" element={<StorePage />} />
                  <Route path="/shopapp/:businessId/product/:productId" element={<ProductDetailPage />} />
                  
                  {/* Redirects from old routes */}
                  <Route path="/:businessId" element={<Navigate to="/shopapp/:businessId" replace />} />
                  <Route path="/:businessId/product/:productId" element={<Navigate to="/shopapp/:businessId/product/:productId" replace />} />
                  <Route path="/store/:businessId" element={<Navigate to="/shopapp/:businessId" replace />} />
                  <Route path="/store/:businessId/product/:productId" element={<Navigate to="/shopapp/:businessId/product/:productId" replace />} />
                  <Route path="/webstore" element={<Navigate to="/dashboard/webstore" replace />} />
                  
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
