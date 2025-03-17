
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSummaries } from "@/components/dashboard/DashboardSummaries";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { useQuery } from "@tanstack/react-query";
import { supabase, db } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ['business-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: customers = [], error: customersError } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        return await db.customers.getAll();
      } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
      }
    },
    enabled: !isLoading,
  });

  const { data: products = [], error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await db.products.getAll();
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
    enabled: !isLoading,
  });

  const { data: orders = [], error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        return await db.orders.getAll();
      } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
    },
    enabled: !isLoading,
  });

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (customersError || productsError || ordersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was a problem loading your dashboard data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader 
        businessName={profile?.business_name || "Your Business"} 
        isLoading={isLoading}
      />
      
      <DashboardSummaries 
        customers={customers} 
        products={products} 
        orders={orders} 
        isLoading={isLoading} 
      />
      
      <DashboardMetrics 
        totalCustomers={customers.length}
        totalProducts={products.length}
        totalOrders={orders.length}
        totalRevenue={totalRevenue}
        lowStockProducts={lowStockProducts}
        isLoading={isLoading}
      />
    </div>
  );
}
