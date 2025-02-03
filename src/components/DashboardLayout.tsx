import { useState } from "react";
import { cn } from "@/lib/utils";
import { DashboardNav } from "./DashboardNav";
import { X } from "lucide-react";
import { ProfileLoader } from "./dashboard/ProfileLoader";
import { TopBar } from "./dashboard/TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProfileLoader>
      <div className="min-h-screen bg-black">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/50 lg:hidden"
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
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DashboardNav />
        </div>

        <div className="lg:pl-64">
          <TopBar 
            onOpenSidebar={() => setSidebarOpen(true)}
            businessProfile={null}  // This will be passed down from ProfileLoader in a future refactor
          />

          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ProfileLoader>
  );
}