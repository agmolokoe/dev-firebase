
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessNameInput } from "@/components/auth/BusinessNameInput";
import { AuthError } from "@/components/auth/AuthError";
import useAuthState from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, isAuthReady } = useAuthState();
  const [businessName, setBusinessName] = useState("");
  
  // Get returnTo path from URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const modeFromUrl = searchParams.get("mode");
  
  // Determine the mode based on URL parameter or prop
  const effectiveMode = modeFromUrl === "signup" ? "signup" : modeFromUrl === "login" ? "login" : mode;
  
  // Check if we're being redirected from a protected page
  useEffect(() => {
    const from = new URLSearchParams(location.search).get("from");
    if (from) {
      setErrorMessage("Please sign in to access that page");
    }
  }, [location.search, setErrorMessage]);

  // If auth is not ready yet, show loading state
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-black border-white/10 overflow-hidden">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 rounded-t-lg opacity-30"></div>
            <CardTitle className="text-2xl font-bold text-center text-white relative z-10">
              {effectiveMode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
        </motion.div>
        
        <CardContent>
          <AuthError message={errorMessage} />
          {effectiveMode === "signup" && (
            <BusinessNameInput
              value={businessName}
              onChange={(value) => {
                setBusinessName(value);
                setErrorMessage(""); // Clear any previous errors
              }}
            />
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#25F4EE",
                    brandAccent: "#FE2C55",
                    brandButtonText: "#000000",
                    inputText: "#FFFFFF",
                    inputBackground: "rgba(255, 255, 255, 0.05)",
                    inputBorder: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            }}
            theme="dark"
            providers={["google", "facebook"]}
            redirectTo={`${window.location.origin}${returnTo}`}
            view={effectiveMode === "login" ? "sign_in" : "sign_up"}
            {...(effectiveMode === "signup" && {
              options: {
                data: {
                  business_name: businessName.trim() || null,
                },
              },
            })}
          />
          <motion.p 
            className="mt-6 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {effectiveMode === "login" ? (
              <>
                Don't have an account?{" "}
                <a href="/auth?mode=signup" className="text-[#25F4EE] hover:underline transition-colors">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/auth?mode=login" className="text-[#25F4EE] hover:underline transition-colors">
                  Log in
                </a>
              </>
            )}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
