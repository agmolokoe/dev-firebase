import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
      
      if (event === "SIGNED_OUT") {
        navigate("/auth");
        setErrorMessage(""); // Clear any existing errors
      }

      if (event === "USER_UPDATED") {
        console.log("User was updated");
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return 'Invalid email or password. Please check your credentials and try again.';
        case 422:
          return 'Email not confirmed. Please check your inbox and verify your email.';
        case 401:
          return 'Unauthorized. Please sign in again.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="m-auto text-white px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to ShopApp</h1>
          <p className="text-xl">Manage your business with ease and efficiency</p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account or create a new one
            </p>
          </div>

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
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                anchor: 'auth-anchor',
                divider: 'my-4',
                label: 'text-sm font-medium text-gray-700',
                input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                message: 'text-sm text-gray-600',
              },
            }}
            providers={["google", "facebook", "twitter"]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
}