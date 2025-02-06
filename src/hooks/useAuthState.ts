
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

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { errorMessage, setErrorMessage };
}

export default useAuthState;
