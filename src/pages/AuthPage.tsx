import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        setErrorMessage(""); // Clear errors on sign out
      }
      
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-black">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0047AB', // Royal Blue
                    brandAccent: '#002366', // Darker Royal Blue
                    brandButtonText: '#FFFFFF',
                    inputText: '#000000',
                    inputBackground: '#FFFFFF',
                    inputBorder: '#0047AB',
                  },
                },
              },
            }}
            theme="light"
            providers={["google", "facebook"]}
            redirectTo="https://rococo-muffin-6b8a71.netlify.app/auth"
          />
        </CardContent>
      </Card>
    </div>
  );
}