
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

// Loading fallback with better styling
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-80px)]">
    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

export default function Index() {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/social/*" element={<SocialPage />} />
          <Route path="/view-store" element={<ViewStorePage />} />
          <Route path="/subscription" element={<Navigate to="/dashboard/subscription" replace />} />
          <Route path="/profile/*" element={<Navigate to="/dashboard/profile/setup" replace />} />
          <Route path="*" element={<DashboardError />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
