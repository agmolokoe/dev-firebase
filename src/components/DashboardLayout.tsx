
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DashboardNav } from "./DashboardNav";
import { X } from "lucide-react";
import { TopBar } from "./dashboard/TopBar";
import { useTenant } from "@/middleware/TenantMiddleware";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTenantId, tenantName, isAdmin, isTenantLoading } = useTenant();

  // Admin mode alert display state
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  
  // Check if we're in admin impersonation mode
  useEffect(() => {
    const isImpersonating = localStorage.getItem('adminUserId') === 'true' && currentTenantId;
    setShowAdminAlert(isImpersonating);
  }, [currentTenantId]);

  // Exit impersonation mode
  const exitImpersonationMode = () => {
    localStorage.removeItem('adminUserId');
    window.location.href = '/admin/businesses';
  };

  return (
    <div className="min-h-screen bg-black">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-black border-r border-white/10 transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">
            {tenantName || 'Dashboard'}
            {isAdmin && <span className="ml-2 text-xs text-primary opacity-80">(Admin)</span>}
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <DashboardNav isAdmin={isAdmin} />
      </div>

      <div className="lg:pl-64">
        <TopBar 
          onOpenSidebar={() => setSidebarOpen(true)}
          businessProfile={null}
        />

        {showAdminAlert && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Impersonation Mode</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>You are viewing as this business owner</span>
                <button 
                  onClick={exitImpersonationMode}
                  className="px-3 py-1 text-sm rounded bg-white text-destructive font-medium"
                >
                  Exit
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {isTenantLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
