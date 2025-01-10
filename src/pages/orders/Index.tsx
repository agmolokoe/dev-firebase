import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  const filteredOrders = orders.filter((order) =>
    order.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => !order.customers).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF]">Orders</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-[#FFFFFF]/60">
                all time orders
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-[#FFFFFF]/60">
                lifetime revenue
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-[#FFFFFF]/60">
                need attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#FFFFFF]/60" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
          />
        </div>

        <div className="rounded-md border border-[#FFFFFF]/10">
          <Table>
            <TableHeader>
              <TableRow className="border-[#FFFFFF]/10">
                <TableHead className="text-[#FFFFFF]">Order ID</TableHead>
                <TableHead className="text-[#FFFFFF]">Customer</TableHead>
                <TableHead className="text-[#FFFFFF]">Date</TableHead>
                <TableHead className="text-[#FFFFFF]">Total</TableHead>
                <TableHead className="text-right text-[#FFFFFF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#FFFFFF]">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#FFFFFF]">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-[#FFFFFF]/10">
                    <TableCell className="text-[#FFFFFF]">#{order.id}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{order.customers?.name || 'Unknown'}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{formatCurrency(Number(order.total_amount))}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        className="text-[#25F4EE] hover:text-[#25F4EE]/90 hover:bg-[#FFFFFF]/5"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}