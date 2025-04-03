
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

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
        setErrorMessage(""); // Clear any previous errors
        toast.success("Successfully signed in!");
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        toast.success("Successfully signed out!");
        navigate("/auth");
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
  }, [navigate]);

  return { errorMessage, setErrorMessage };
}

export default useAuthState;
