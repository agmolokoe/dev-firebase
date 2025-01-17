import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart } from "lucide-react";
import CustomersPage from "./customers/Index";
import OrdersPage from "./orders/Index";
import ProductsPage from "./products/Index";
import SocialPage from "./social/Index";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Index() {
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setBusinessId(session?.user?.id || null);
    };
    getSession();
  }, []);

  const { data: customers = [] } = useQuery({
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

  const { data: products = [] } = useQuery({
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

  const { data: orders = [] } = useQuery({
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

  // Calculate metrics
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

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

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-black text-white border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                      Active customer accounts
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black text-white border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      {lowStockProducts} products low in stock
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black text-white border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      Processed orders
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black text-white border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="h-4 w-4 text-muted-foreground">$</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                      Lifetime revenue
                    </p>
                  </CardContent>
                </Card>
              </div>

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