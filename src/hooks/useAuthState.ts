
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { toast } from "sonner";

function useAuthState() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);

      if (event === "SIGNED_IN" && session) {
        toast.success("Successfully signed in!");
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        toast.success("Successfully signed out!");
      }

      if (event === "USER_UPDATED" && !session) {
        const { error } = await supabase.auth.getSession();
        if (error) {
          const message = getAuthErrorMessage(error);
          setErrorMessage(message);
          toast.error(message);
        }
      }
    });

    // Listen for auth errors
    const handleAuthError = (error: any) => {
      const message = getAuthErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    };

    // Subscribe to auth errors
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY_ERROR" || event === "SIGN_IN_ERROR" || event === "SIGN_UP_ERROR") {
        console.error("Auth error event:", event);
        handleAuthError(session);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (authListener) authListener.unsubscribe();
    };
  }, [navigate]);

  return { errorMessage, setErrorMessage };
}

export default useAuthState;
