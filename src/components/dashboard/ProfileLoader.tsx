
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ProfileLoader({ children }: { children: React.ReactNode }) {
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          navigate('/auth');
          return;
        }
        
        // Skip profile check if we're already on the setup page
        if (location.pathname === '/dashboard/profile/setup') {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (fetchError) {
          console.error('Error fetching business profile:', fetchError);
          setError('Could not load business profile');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load business profile",
          });
          return;
        }
        
        if (!data && !location.pathname.includes('/profile/setup')) {
          console.log('No business profile found, redirecting to setup');
          toast({
            title: "Profile Setup Required",
            description: "Please complete your business profile setup",
          });
          navigate('/dashboard/profile/setup');
          return;
        }
        
        setBusinessProfile(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [navigate, toast, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
}

