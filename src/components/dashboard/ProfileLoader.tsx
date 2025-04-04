
import { useEffect, useState, useCallback } from "react";
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

  // List of paths that don't require a complete profile
  const exemptPaths = [
    '/dashboard/profile/setup', 
    '/dashboard/subscription', 
    '/auth'
  ];

  const fetchBusinessProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        // Don't navigate if we're already on the auth page
        if (location.pathname !== '/auth') {
          navigate('/auth');
        }
        return;
      }
      
      // Skip profile check if we're on an exempt path
      if (exemptPaths.some(path => location.pathname.startsWith(path))) {
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
      
      // Only redirect to setup if we're not on an exempt path and there's no profile
      if (!data && !exemptPaths.some(path => location.pathname.includes(path))) {
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
  }, [navigate, toast, location.pathname, exemptPaths]);

  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

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
