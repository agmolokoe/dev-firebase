
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/context/TenantContext";

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
    const { isAdmin, isTenantLoading, permissions } = useTenant();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    useEffect(() => {
      if (!isTenantLoading && !isAdmin) {
        navigate('/dashboard');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this area",
          variant: "destructive",
        });
      }
    }, [isAdmin, isTenantLoading, navigate, toast]);
    
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

// New HOC for permission-based protection
export const withPermissionProtection = (
  Component: React.ComponentType<any>, 
  requiredPermission: keyof RolePermissions
) => {
  return (props: any) => {
    const { permissions, isTenantLoading } = useTenant();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const hasPermission = permissions[requiredPermission];
    
    useEffect(() => {
      if (!isTenantLoading && !hasPermission) {
        navigate('/dashboard');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this feature",
          variant: "destructive",
        });
      }
    }, [hasPermission, isTenantLoading, navigate, toast]);
    
    if (isTenantLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      );
    }
    
    if (!hasPermission) {
      return null; // Will redirect via effect
    }
    
    return <Component {...props} />;
  };
};
