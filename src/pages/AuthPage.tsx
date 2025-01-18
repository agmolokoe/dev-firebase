import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessNameInput } from "@/components/auth/BusinessNameInput";
import { AuthError } from "@/components/auth/AuthError";
import useAuthState from "@/hooks/useAuthState";

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
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            {...(mode === "signup" && {
              options: {
                data: {
                  business_name: businessName.trim() || null,
                },
              },
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}

<lov-write file_path="src/utils/auth-errors.ts">
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getAuthErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("invalid_credentials")) {
          return "Invalid email or password. Please check your credentials and try again.";
        }
        return "Invalid request. Please check your input and try again.";
      case 422:
        return "Invalid email format or weak password. Please check your input.";
      case 500:
        if (error.message.includes("Database error saving new user")) {
          return "An error occurred while creating your account. Please try again.";
        }
        return "An unexpected server error occurred. Please try again later.";
      default:
        return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
};

<lov-write file_path="src/hooks/useAuthState.ts">
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAuthErrorMessage } from "@/utils/auth-errors";

function useAuthState() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        setErrorMessage("");
      }

      if (event === "USER_UPDATED" && !session) {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getAuthErrorMessage(error));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { errorMessage, setErrorMessage };
}

export default useAuthState;