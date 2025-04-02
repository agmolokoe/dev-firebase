
import { useTenant } from "@/context/TenantContext";
import { TenantProvider } from "@/providers/TenantProvider";
import { withTenantProtection, withAdminProtection, withPermissionProtection } from "@/hoc/withProtection";
import type { RolePermissions, TenantRole } from "@/context/TenantContext";

export {
  useTenant,
  TenantProvider,
  withTenantProtection,
  withAdminProtection,
  withPermissionProtection
};

export type {
  RolePermissions,
  TenantRole
};
