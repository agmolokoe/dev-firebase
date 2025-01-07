import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      }

      if (event === "USER_UPDATED") {
        console.log("User was updated");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

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
              },
            }}
            providers={["google", "facebook", "twitter"]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
          />
        </div>
      </div>
    </div>
  );
}