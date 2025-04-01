
import { useEffect, createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Create a context to hold the current tenant information
interface TenantContextType {
  currentTenantId: string | null;
  isAdmin: boolean;
  tenantName: string | null;
  tenantRole: 'owner' | 'admin' | 'staff' | null;
  isTenantLoading: boolean;
  setCurrentTenant: (tenantId: string | null) => void;
}

const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  isAdmin: false,
  tenantName: null,
  tenantRole: null,
  isTenantLoading: true,
  setCurrentTenant: () => {}
});

export const useTenant = () => useContext(TenantContext);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [tenantRole, setTenantRole] = useState<'owner' | 'admin' | 'staff' | null>(null);
  const [isTenantLoading, setIsTenantLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for authentication and set up tenant information
    const checkSession = async () => {
      try {
        setIsTenantLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session, tenant context not established");
          setIsTenantLoading(false);
          return;
        }
        
        const userId = session.user.id;

        // Get the user's business profile
        const { data: businessProfile, error: businessError } = await supabase
          .from('business_profiles')
          .select('id, business_name, settings')
          .eq('id', userId)
          .single();

        if (businessError) {
          console.error("Error fetching business profile:", businessError);
          toast({
            title: "Error",
            description: "Failed to load business information",
            variant: "destructive",
          });
          setIsTenantLoading(false);
          return;
        }

        // Check if user has admin privileges (stored in settings.role)
        const userRole = businessProfile?.settings?.role || 'owner';
        const isAdminUser = userRole === 'admin' || userRole === 'owner' || 
                          session.user.email === 'admin@basetishop.com'; // Fallback admin check
        
        console.log(`Tenant context established: ${businessProfile.id} (${businessProfile.business_name})`);
        
        setCurrentTenantId(businessProfile.id);
        setTenantName(businessProfile.business_name);
        setIsAdmin(isAdminUser);
        setTenantRole(userRole as 'owner' | 'admin' | 'staff');

      } catch (error) {
        console.error("Error in tenant middleware:", error);
        toast({
          title: "System Error",
          description: "Failed to establish tenant context",
          variant: "destructive",
        });
      } finally {
        setIsTenantLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes to update tenant context
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in tenant middleware:", event);
      
      // Only process if login/logout/token refresh
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        await checkSession();
      }
    });

    return () => {
      // Clean up subscription
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, toast]);

  const setCurrentTenant = (tenantId: string | null) => {
    // For admin users who can switch between tenants
    if (isAdmin) {
      setCurrentTenantId(tenantId);
      
      // Fetch the tenant name for the selected tenant
      if (tenantId) {
        const fetchTenantName = async () => {
          const { data, error } = await supabase
            .from('business_profiles')
            .select('business_name')
            .eq('id', tenantId)
            .single();
            
          if (!error && data) {
            setTenantName(data.business_name);
          }
        };
        
        fetchTenantName();
      }
    }
  };

  return (
    <TenantContext.Provider 
      value={{ 
        currentTenantId, 
        isAdmin, 
        tenantName, 
        tenantRole,
        isTenantLoading, 
        setCurrentTenant 
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

// Higher-order component to restrict access to tenant-specific routes
export const withTenantProtection = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { currentTenantId, isTenantLoading } = useTenant();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isTenantLoading && !currentTenantId) {
        navigate('/auth');
      }
    }, [currentTenantId, isTenantLoading, navigate]);
    
    if (isTenantLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      );
    }
    
    if (!currentTenantId) {
      return null; // Will redirect via effect
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component to restrict access to admin-only routes
export const withAdminProtection = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { isAdmin, isTenantLoading } = useTenant();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isTenantLoading && !isAdmin) {
        navigate('/dashboard');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this area",
          variant: "destructive",
        });
      }
    }, [isAdmin, isTenantLoading, navigate]);
    
    if (isTenantLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      );
    }
    
    if (!isAdmin) {
      return null; // Will redirect via effect
    }
    
    return <Component {...props} />;
  };
};
