
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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, isAuthReady, isLoading } = useAuthState();
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
  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white/70 animate-pulse">Setting up your secure connection...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-black p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="absolute top-4 left-4 md:top-8 md:left-8"
        variants={itemVariants}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </motion.div>
      
      <motion.div 
        className="w-full max-w-md"
        variants={itemVariants}
      >
        <Card className="w-full bg-black border-white/10 overflow-hidden shadow-glow-teal">
          <motion.div
            variants={itemVariants}
          >
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 rounded-t-lg opacity-30"></div>
              <CardTitle className="text-2xl font-bold text-center text-white relative z-10 flex flex-col gap-1">
                <span className="text-[#25F4EE]">Baseti</span>
                <span className="text-white">Social Shop</span>
                <span className="text-base font-normal mt-2">
                  {effectiveMode === "login" ? "Welcome Back" : "Create Account"}
                </span>
              </CardTitle>
            </CardHeader>
          </motion.div>
          
          <CardContent>
            <AuthError message={errorMessage} />
            {effectiveMode === "signup" && (
              <motion.div variants={itemVariants}>
                <BusinessNameInput
                  value={businessName}
                  onChange={(value) => {
                    setBusinessName(value);
                    setErrorMessage(""); // Clear any previous errors
                  }}
                />
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
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
                        anchorTextColor: "#25F4EE",
                        anchorTextHoverColor: "#FE2C55",
                      },
                      fonts: {
                        bodyFontFamily: "Inter, sans-serif",
                        buttonFontFamily: "Inter, sans-serif",
                        inputFontFamily: "Inter, sans-serif",
                        labelFontFamily: "Inter, sans-serif",
                      },
                      radii: {
                        borderRadiusButton: "8px",
                        buttonBorderRadius: "8px",
                        inputBorderRadius: "8px",
                      },
                    },
                  },
                  className: {
                    button: "bg-gradient-to-r from-[#25F4EE] to-[#25F4EE] hover:from-[#25F4EE] hover:to-[#20D6D1] text-black font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md",
                    input: "bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-[#25F4EE]/50 focus:border-[#25F4EE]/50 transition-all duration-300",
                    label: "text-white/80 font-medium",
                    container: "space-y-4",
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
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="mt-8 text-sm text-center">
                {effectiveMode === "login" ? (
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <a 
                      href="/auth?mode=signup" 
                      className="text-[#25F4EE] hover:text-[#FE2C55] hover:underline transition-colors duration-300"
                    >
                      Sign up
                    </a>
                  </p>
                ) : (
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <a 
                      href="/auth?mode=login" 
                      className="text-[#25F4EE] hover:text-[#FE2C55] hover:underline transition-colors duration-300"
                    >
                      Log in
                    </a>
                  </p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{" "}
                  <a 
                    href="/terms-of-service" 
                    className="text-[#25F4EE] hover:text-[#FE2C55] hover:underline transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a 
                    href="/privacy-policy" 
                    className="text-[#25F4EE] hover:text-[#FE2C55] hover:underline transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
