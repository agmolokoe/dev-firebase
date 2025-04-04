
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileLoader } from "@/components/dashboard/ProfileLoader";
import { DashboardError } from "@/components/dashboard/DashboardError";

// Lazy load page components
const Dashboard = lazy(() => import("./dashboard/Index"));
const CustomersPage = lazy(() => import("./customers/Index"));
const ProductsPage = lazy(() => import("./products/Index"));
const OrdersPage = lazy(() => import("./orders/Index"));
const SocialPage = lazy(() => import("./social/Index"));
const ViewStorePage = lazy(() => import("./dashboard/ViewStorePage"));
const SettingsPage = lazy(() => import("./settings/Index"));
const ReportsPage = lazy(() => import("./reports/Index"));
const SupportPage = lazy(() => import("./support/Index"));
const MarketingPage = lazy(() => import("./marketing/Index"));

// Admin pages
const BusinessList = lazy(() => import("./admin/BusinessList"));
const BusinessDetail = lazy(() => import("./admin/BusinessDetail"));

// Loading fallback with better styling
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-80px)]">
    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

export default function Index() {
  return (
    <DashboardLayout>
      <ProfileLoader>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Standard routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/*" element={<CustomersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/*" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/*" element={<OrdersPage />} />
            <Route path="/social/*" element={<SocialPage />} />
            <Route path="/view-store" element={<ViewStorePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/*" element={<ReportsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/*" element={<SupportPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/marketing/*" element={<MarketingPage />} />
            
            {/* Admin routes */}
            <Route path="/admin/businesses" element={<BusinessList />} />
            <Route path="/admin/business/:id/:section" element={<BusinessDetail />} />
            
            {/* Redirects */}
            <Route path="/subscription" element={<Navigate to="/dashboard/subscription" replace />} />
            <Route path="/profile/*" element={<Navigate to="/dashboard/profile/setup" replace />} />
            <Route path="*" element={<DashboardError />} />
          </Routes>
        </Suspense>
      </ProfileLoader>
    </DashboardLayout>
  );
}
