
import { createContext, useContext } from "react";

// Create a context to hold the current tenant information
interface TenantContextType {
  currentTenantId: string | null;
  isAdmin: boolean;
  tenantName: string | null;
  tenantRole: 'owner' | 'admin' | 'staff' | null;
  isTenantLoading: boolean;
  setCurrentTenant: (tenantId: string | null) => void;
}

export const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  isAdmin: false,
  tenantName: null,
  tenantRole: null,
  isTenantLoading: true,
  setCurrentTenant: () => {}
});

export const useTenant = () => useContext(TenantContext);
