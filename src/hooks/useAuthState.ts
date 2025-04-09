
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

function useAuthState() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check current session on mount
    const checkCurrentSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setIsAuthReady(true);
          setIsLoading(false);
          return;
        }
        
        // Set the session in state
        setSession(data.session);
        
        // Set auth ready after we've checked the session
        setIsAuthReady(true);
        
        // If on auth page but already authenticated, redirect to dashboard
        if (data.session && location.pathname === '/auth') {
          // Check if there's a return path in the URL
          const params = new URLSearchParams(location.search);
          const returnTo = params.get('returnTo');
          navigate(returnTo || '/dashboard', { replace: true });
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        setIsAuthReady(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCurrentSession();
    
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      // Update session state
      setSession(session);

      if (event === "SIGNED_IN" && session) {
        setErrorMessage(""); // Clear any previous errors
        toast.success("Successfully signed in! Welcome to Baseti Social Shop.");
        
        // Check for returnTo parameter
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('returnTo');
        navigate(returnTo || "/dashboard", { replace: true });
      }

      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        toast.success("Successfully signed out. See you soon!");
        navigate("/auth", { replace: true });
      }

      if (event === "PASSWORD_RECOVERY") {
        toast.info("Please check your email to reset your password.");
      }

      // Handle social login events
      if (event === "USER_UPDATED" && session) {
        setErrorMessage("");
        toast.success("Account updated successfully!");
      }

      if (event === "USER_UPDATED" && !session) {
        try {
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            const message = getAuthErrorMessage(sessionError);
            setErrorMessage(message);
            toast.error(message);
            return;
          }

          if (!data.session) {
            setErrorMessage("Please sign in to continue.");
            navigate("/auth");
          }
        } catch (err) {
          if (err instanceof AuthError) {
            const message = getAuthErrorMessage(err);
            setErrorMessage(message);
            toast.error(message);
          } else {
            console.error("Unexpected error:", err);
            toast.error("An unexpected error occurred. Please try again.");
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, location.search]);

  return { errorMessage, setErrorMessage, isAuthReady, session, isLoading };
}

export default useAuthState;
