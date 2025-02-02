import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomersPage from "./customers/Index";
import OrdersPage from "./orders/Index";
import ProductsPage from "./products/Index";
import SocialPage from "./social/Index";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  // Show error toast for any query errors
  useEffect(() => {
    if (customersError || productsError || ordersError) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard data",
        description: "Please try refreshing the page",
      });
    }
  }, [customersError, productsError, ordersError, toast]);

  // Calculate metrics
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
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                  Welcome to your shop dashboard. Here's an overview of your business.
                </p>
              </div>

              {hasError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    There was a problem loading your dashboard data. Please try refreshing the page.
                  </AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-black/50 text-white border-white/10 animate-pulse">
                      <CardHeader className="h-24" />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-to-br from-primary/20 to-black text-white border-white/10 transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        Active customer accounts
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/20 to-black text-white border-white/10 transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalProducts}</div>
                      <p className="text-xs text-muted-foreground">
                        {lowStockProducts} products low in stock
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-success/20 to-black text-white border-white/10 transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Processed orders
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-destructive/20 to-black text-white border-white/10 transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <div className="h-4 w-4 text-destructive">$</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                      <p className="text-xs text-muted-foreground">
                        Lifetime revenue
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {!isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-black text-white border-white/10">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center">
                          <span>Order #{order.id}</span>
                          <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black text-white border-white/10">
                  <CardHeader>
                    <CardTitle>Low Stock Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {products
                        .filter(product => (product.stock || 0) < 10)
                        .slice(0, 5)
                        .map((product) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <span>{product.name}</span>
                            <span>{product.stock} in stock</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black text-white border-white/10">
                  <CardHeader>
                    <CardTitle>Recent Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {customers.slice(0, 5).map((customer) => (
                        <div key={customer.id} className="flex justify-between items-center">
                          <span>{customer.name}</span>
                          <span className="text-muted-foreground">{customer.email}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                </div>
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
