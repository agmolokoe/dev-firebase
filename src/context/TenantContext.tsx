
import { createContext, useContext } from "react";

// Define roles and their capabilities
export type TenantRole = 'owner' | 'admin' | 'staff' | null;

export interface RolePermissions {
  canManageUsers: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canViewAnalytics: boolean;
  canChangeSettings: boolean;
}

// Create a context to hold the current tenant information
export interface TenantContextType {
  currentTenantId: string | null;
  isAdmin: boolean;
  tenantName: string | null;
  tenantRole: TenantRole;
  isTenantLoading: boolean;
  setCurrentTenant: (tenantId: string | null) => void;
  permissions: RolePermissions;
  // New helper function to check specific permissions
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

// Default permissions based on role
export const getDefaultPermissions = (role: TenantRole): RolePermissions => {
  switch (role) {
    case 'owner':
      return {
        canManageUsers: true,
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canChangeSettings: true
      };
    case 'admin':
      return {
        canManageUsers: true,
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canChangeSettings: false
      };
    case 'staff':
      return {
        canManageUsers: false,
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: false,
        canChangeSettings: false
      };
    default:
      return {
        canManageUsers: false,
        canManageProducts: false,
        canManageOrders: false,
        canViewAnalytics: false,
        canChangeSettings: false
      };
  }
};

export const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  isAdmin: false,
  tenantName: null,
  tenantRole: null,
  isTenantLoading: true,
  setCurrentTenant: () => {},
  permissions: getDefaultPermissions(null),
  hasPermission: () => false
});

export const useTenant = () => useContext(TenantContext);
