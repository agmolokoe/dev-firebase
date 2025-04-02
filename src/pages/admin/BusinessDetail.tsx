import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useTenant, withAdminProtection } from "@/middleware";
import { 
  ArrowLeft, 
  BarChart4, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings,
  ExternalLink,
  Trash2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function BusinessDetail() {
  const { id: businessId, section = 'analytics' } = useParams();
  const [businessData, setBusinessData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Analytics data states
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [customerDistribution, setCustomerDistribution] = useState<any[]>([]);

  const fetchBusinessData = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch business profile
      const { data: business, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', businessId)
        .single();
      
      if (businessError) {
        console.error("Error fetching business profile:", businessError);
        toast({
          title: "Error",
          description: "Failed to load business data",
          variant: "destructive",
        });
        return;
      }
      
      setBusinessData(business);
      
      // Load data based on active section
      if (section === 'analytics' || section === 'products') {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (productsError) {
          console.error("Error fetching products:", productsError);
        } else {
          setProducts(productsData || []);
        }
      }
      
      if (section === 'analytics' || section === 'customers') {
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (customersError) {
          console.error("Error fetching customers:", customersError);
        } else {
          setCustomers(customersData || []);
        }
      }
      
      if (section === 'analytics' || section === 'orders') {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            customers (
              name,
              email
            )
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setOrders(ordersData || []);
        }
      }
      
      // Generate analytics data if on analytics tab
      if (section === 'analytics') {
        generateAnalyticsData(products, customers, orders);
      }
    } catch (error) {
      console.error("Unexpected error loading business data:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [businessId, section, toast, products, customers, orders]);

  const generateAnalyticsData = (products: any[], customers: any[], orders: any[]) => {
    // Generate monthly sales data for the past 6 months
    const salesByMonth = new Map();
    const today = new Date();
    
    // Initialize with the past 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      salesByMonth.set(monthYear, { month: monthYear, sales: 0, orders: 0 });
    }
    
    // Populate with actual order data
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const monthYear = `${orderDate.toLocaleString('default', { month: 'short' })} ${orderDate.getFullYear()}`;
      
      if (salesByMonth.has(monthYear)) {
        const existing = salesByMonth.get(monthYear);
        salesByMonth.set(monthYear, {
          ...existing,
          sales: existing.sales + (order.total_amount || 0),
          orders: existing.orders + 1
        });
      }
    });
    
    setSalesData(Array.from(salesByMonth.values()));
    
    // Calculate product performance
    const productSales = new Map();
    
    // Initialize with all products
    products.forEach(product => {
      productSales.set(product.id, {
        name: product.name,
        sales: 0,
        units: 0
      });
    });
    
    // TODO: This is a placeholder as we don't have order items yet
    // In a real implementation, you would calculate actual sales per product
    const mockProductPerformance = products.slice(0, 5).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 5000) + 500,
      units: Math.floor(Math.random() * 50) + 5
    }));
    
    setProductPerformance(mockProductPerformance);
    
    // Customer distribution data
    // This is a placeholder - in a real app you would aggregate actual data
    const customerRegions = [
      { name: 'New', value: customers.filter(c => 
        new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
      { name: 'Returning', value: Math.floor(customers.length * 0.6) },
      { name: 'Inactive', value: Math.floor(customers.length * 0.2) }
    ];
    
    setCustomerDistribution(customerRegions);
  };

  const handleChangeSection = (newSection: string) => {
    navigate(`/admin/business/${businessId}/${newSection}`);
  };

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData, businessId, section]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAvgOrderValue = () => {
    if (orders.length === 0) return 0;
    const total = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    return total / orders.length;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/businesses')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {businessData?.business_name || 'Business Details'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {businessData?.business_description || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => window.open(`/store/${businessId}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Store
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Business
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete this business account and all associated data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue={section} onValueChange={handleChangeSection} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">
              <BarChart4 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="h-4 w-4 mr-2" />
              Customers ({customers.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{customers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(getAvgOrderValue())}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Sales Over Time</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productPerformance}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        <Bar dataKey="sales" fill="#8884d8">
                          {productPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Customer segments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {customerDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Customers']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  All products for {businessData?.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Margin</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {product.image_url ? (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                    P
                                  </div>
                                )}
                                <div>
                                  <div>{product.name}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {product.description || 'No description'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(product.selling_price)}</TableCell>
                            <TableCell>{formatCurrency(product.cost_price)}</TableCell>
                            <TableCell>
                              {(((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              {new Date(product.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  All customers for {businessData?.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            No customers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        customers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone || 'N/A'}</TableCell>
                            <TableCell>
                              {new Date(customer.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  All orders for {businessData?.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              {order.customers?.name || 'Unknown Customer'}
                            </TableCell>
                            <TableCell>{formatCurrency(order.total_amount || 0)}</TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>
                    View and manage business account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
                        <p className="text-base">{businessData?.business_name || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-base">{businessData?.contact_email || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                        <p className="text-base">{businessData?.contact_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                        <p className="text-base">{businessData?.industry || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Subscription Tier</h3>
                        <p className="text-base capitalize">{businessData?.subscription_tier || 'Free'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Subscription Status</h3>
                        <p className="text-base capitalize">{businessData?.subscription_status || 'Active'}</p>
                      </div>
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p className="text-base">{businessData?.business_description || 'No description provided'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-muted">
                      <h3 className="text-base font-medium mb-2">Subscription Management</h3>
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-3 gap-4">
                          <Button variant="outline">Change Tier</Button>
                          <Button variant="outline">View Invoices</Button>
                          <Button variant="outline">Manage Features</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withAdminProtection(BusinessDetail);
