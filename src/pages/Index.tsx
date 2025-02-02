import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";
import CustomersPage from "./customers/Index";
import OrdersPage from "./orders/Index";
import ProductsPage from "./products/Index";
import SocialPage from "./social/Index";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardSummaries } from "@/components/dashboard/DashboardSummaries";

export default function Index() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setBusinessId(session?.user?.id || null);
    };
    getSession();
  }, []);

  const { data: customers = [], error: customersError, isLoading: customersLoading } = useQuery({
    queryKey: ['dashboard-customers', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessId);
      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  const { data: products = [], error: productsError, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboard-products', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId);
      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  const { data: orders = [], error: ordersError, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboard-orders', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessId);
      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });

  useEffect(() => {
    if (customersError || productsError || ordersError) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard data",
        description: "Please try refreshing the page",
      });
    }
  }, [customersError, productsError, ordersError, toast]);

  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

  const isLoading = customersLoading || productsLoading || ordersLoading;
  const hasError = customersError || productsError || ordersError;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
              <DashboardHeader />
              {hasError && <DashboardError />}
              <DashboardMetrics
                totalCustomers={totalCustomers}
                totalProducts={totalProducts}
                totalOrders={totalOrders}
                totalRevenue={totalRevenue}
                lowStockProducts={lowStockProducts}
                isLoading={isLoading}
              />
              {!isLoading && (
                <DashboardSummaries
                  orders={orders}
                  products={products}
                  customers={customers}
                />
              )}
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