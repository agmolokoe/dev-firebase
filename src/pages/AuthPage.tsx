
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

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, isAuthReady } = useAuthState();
  const [businessName, setBusinessName] = useState("");
  
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AuthError message={errorMessage} />
          {mode === "signup" && (
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
                    brand: "#000000",
                    brandAccent: "#333333",
                    brandButtonText: "#FFFFFF",
                    inputText: "#FFFFFF",
                    inputBackground: "rgba(255, 255, 255, 0.05)",
                    inputBorder: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
            }}
            theme="dark"
            providers={["google", "facebook"]}
            redirectTo={`${window.location.origin}/dashboard`}
            {...(mode === "signup" && {
              options: {
                data: {
                  business_name: businessName.trim() || null,
                },
              },
            })}
          />
          <p className="mt-4 text-sm text-gray-400 text-center">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <a href="/auth?mode=signup" className="text-white hover:underline">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/auth?mode=login" className="text-white hover:underline">
                  Log in
                </a>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
