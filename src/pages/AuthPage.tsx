
import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessNameInput } from "@/components/auth/BusinessNameInput";
import { AuthError } from "@/components/auth/AuthError";
import useAuthState from "@/hooks/useAuthState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthErrorMessage } from "@/utils/auth-errors";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { errorMessage, setErrorMessage } = useAuthState();
  const [businessName, setBusinessName] = useState("");

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
            providers={["google"]}
            redirectTo={`${window.location.origin}/dashboard`}
            onAuthError={(error) => {
              console.error("Auth error:", error);
              setErrorMessage(getAuthErrorMessage(error));
            }}
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
