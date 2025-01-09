import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import CustomersPage from "./customers/Index";
import OrdersPage from "./orders/Index";
import ProductsPage from "./products/Index";
import SocialPage from "./social/Index";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <div className="container mx-auto p-6">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome to your shop dashboard
              </p>
            </div>
          </DashboardLayout>
        }
      />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/social" element={<SocialPage />} />
    </Routes>
  );
}