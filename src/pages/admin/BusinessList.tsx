
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { withAdminProtection } from "@/middleware/TenantMiddleware";
import { Eye, Edit, Settings, BarChart4, Users, Package, ShoppingCart } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BusinessProfile {
  id: string;
  business_name: string;
  business_description: string | null;
  contact_email: string | null;
  subscription_tier: string;
  created_at: string;
  logo_url: string | null;
  productCount: number;
  customerCount: number;
  orderCount: number;
  totalRevenue: number;
}

function BusinessList() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch business profiles
      const { data: businessProfiles, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (businessError) {
        console.error("Error fetching business profiles:", businessError);
        toast({
          title: "Error",
          description: "Failed to load business data",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch additional stats for each business
      const businessesWithStats = await Promise.all(
        (businessProfiles || []).map(async (business) => {
          // Get product count
          const { count: productCount, error: productError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', business.id);
            
          if (productError) {
            console.error(`Error counting products for ${business.id}:`, productError);
          }
          
          // Get customer count
          const { count: customerCount, error: customerError } = await supabase
            .from('customers')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', business.id);
            
          if (customerError) {
            console.error(`Error counting customers for ${business.id}:`, customerError);
          }
          
          // Get order count and total revenue
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('business_id', business.id);
            
          if (ordersError) {
            console.error(`Error fetching orders for ${business.id}:`, ordersError);
          }
          
          const orderCount = orders?.length || 0;
          const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
          
          return {
            ...business,
            productCount: productCount || 0,
            customerCount: customerCount || 0,
            orderCount,
            totalRevenue
          };
        })
      );
      
      setBusinesses(businessesWithStats);
      setFilteredBusinesses(businessesWithStats);
    } catch (error) {
      console.error("Unexpected error loading businesses:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = businesses.filter(business => 
        (business.business_name || '').toLowerCase().includes(lowercaseSearch) ||
        (business.business_description || '').toLowerCase().includes(lowercaseSearch) ||
        (business.contact_email || '').toLowerCase().includes(lowercaseSearch)
      );
      setFilteredBusinesses(filtered);
    }
  }, [searchTerm, businesses]);

  const handleNavigateToBusinessData = (businessId: string, section: string) => {
    navigate(`/admin/business/${businessId}/${section}`);
  };

  const handleImpersonate = (businessId: string) => {
    // Store the admin's original user ID to allow returning to admin view
    localStorage.setItem('adminUserId', 'true');
    
    // Navigate to the business's dashboard
    navigate(`/dashboard?business=${businessId}`);
    
    toast({
      title: "Impersonation Mode",
      description: "You are now viewing as this business owner",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSubscriptionBadgeClass = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-black';
      case 'basic':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-400 text-white';
    }
  };

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all business accounts in the platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Button onClick={loadBusinesses}>Refresh</Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{businesses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Premium Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {businesses.filter(b => b.subscription_tier === 'premium').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Basic Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {businesses.filter(b => b.subscription_tier === 'basic').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(businesses.reduce((sum, business) => sum + business.totalRevenue, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Business List</CardTitle>
            <CardDescription>
              View and manage all business accounts on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {business.logo_url ? (
                            <img 
                              src={business.logo_url} 
                              alt={business.business_name || 'Business'} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {(business.business_name || 'B').charAt(0)}
                            </div>
                          )}
                          <div>
                            <div>{business.business_name || 'Unnamed Business'}</div>
                            <div className="text-xs text-muted-foreground">{business.contact_email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium py-1 px-2 rounded-full ${getSubscriptionBadgeClass(business.subscription_tier)}`}>
                          {business.subscription_tier || 'free'}
                        </span>
                      </TableCell>
                      <TableCell>{business.productCount}</TableCell>
                      <TableCell>{business.customerCount}</TableCell>
                      <TableCell>{business.orderCount}</TableCell>
                      <TableCell>{formatCurrency(business.totalRevenue)}</TableCell>
                      <TableCell>
                        {new Date(business.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleImpersonate(business.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View as Business
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigateToBusinessData(business.id, 'analytics')}>
                              <BarChart4 className="h-4 w-4 mr-2" />
                              Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigateToBusinessData(business.id, 'products')}>
                              <Package className="h-4 w-4 mr-2" />
                              Products
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigateToBusinessData(business.id, 'customers')}>
                              <Users className="h-4 w-4 mr-2" />
                              Customers
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigateToBusinessData(business.id, 'orders')}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleNavigateToBusinessData(business.id, 'settings')}>
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export with admin protection
export default withAdminProtection(BusinessList);
