function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("useAuthState hook initialized");

    const checkCurrentSession = async () => {
      try {
        console.log("Checking current session");
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking session:", error);
          setIsAuthReady(true);
          setIsLoading(false);
          return;
        }

        console.log("Session check result:", data.session ? "Session exists" : "No session");

        // Set the session in state
        setSession(data.session);

        // Set auth ready after we've checked the session
        setIsAuthReady(true);

        // If on auth page but already authenticated, redirect to dashboard
        if (data.session && location.pathname === '/auth') {
          console.log("Already authenticated, redirecting from auth page");
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

    // Set up auth state change listener
    console.log("Setting up auth state change listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "Session:", session ? "exists" : "null");

      // Update session state
      setSession(session);

      if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully");
        setErrorMessage("");
        toast.success("Successfully signed in! Welcome to Baseti Social Shop.");
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setErrorMessage("");
        toast.success("Successfully signed out. See you soon!");
        navigate("/auth", { replace: true });
      }

      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery initiated");
        toast.info("Please check your email to reset your password.");
      }

      if (event === "USER_UPDATED" && session) {
        console.log("User account updated");
        setErrorMessage("");
        toast.success("Account updated successfully!");
      }

      if (event === "USER_UPDATED" && !session) {
        console.log("User updated but no session available");
        try {
          const { data, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Session error:", sessionError);
            const message = getAuthErrorMessage(sessionError);
            setErrorMessage(message);
            toast.error(message);
            return;
          }

          if (!data.session) {
            console.log("No session available after update");
            setErrorMessage("Please sign in to continue.");
            navigate("/auth");
          }
        } catch (err) {
          console.error("Error in USER_UPDATED handler:", err);
          if (err instanceof AuthError) {
            const message = getAuthErrorMessage(err);
            setErrorMessage(message);
            toast.error(message);
          }
        }
      }
    });

    // Check current session after setting up listener
    checkCurrentSession();

    return () => {
      console.log("useAuthState cleanup - unsubscribing");
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, location.search]);

  return { session, isAuthReady, isLoading, errorMessage };
}
