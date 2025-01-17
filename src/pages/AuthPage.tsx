import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        setErrorMessage("");
      }

      if (event === "USER_UPDATED" && !session) {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("invalid_credentials")) {
            return "Invalid email or password. Please check your credentials and try again.";
          }
          return "Invalid request. Please check your input and try again.";
        case 422:
          try {
            const errorBody = JSON.parse(error.message);
            if (errorBody.code === "weak_password") {
              return "Password must be at least 6 characters long.";
            }
          } catch {
            // If parsing fails, fall through to default message
          }
          return "Invalid email format or weak password. Please check your input.";
        case 500:
          return "An unexpected server error occurred. Please try again later.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {mode === "signup" && (
            <div className="mb-4">
              <Label htmlFor="businessName" className="text-white">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter your business name"
                required
              />
            </div>
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
            onlyThirdPartyProviders={false}
            {...(mode === "signup" && {
              options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
                data: {
                  business_name: businessName || 'My Business',
                },
              },
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}