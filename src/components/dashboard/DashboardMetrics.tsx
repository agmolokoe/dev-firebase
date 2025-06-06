
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetricsProps {
  totalCustomers?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  lowStockProducts?: number;
  isLoading: boolean;
}

export function DashboardMetrics({
  totalCustomers = 0,
  totalProducts = 0,
  totalOrders = 0,
  totalRevenue = 0,
  lowStockProducts = 0,
  isLoading
}: DashboardMetricsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-black/50 text-white border-white/10">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-2/3 bg-gray-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="bg-gradient-to-br from-primary/20 to-black text-white border-white/10 transition-all hover:scale-105 cursor-pointer group"
        onClick={() => navigate('/customers')}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Active customer accounts</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-secondary/20 to-black text-white border-white/10 transition-all hover:scale-105 cursor-pointer group"
        onClick={() => navigate('/products')}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-secondary" />
            <ExternalLink className="h-4 w-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">{lowStockProducts} products low in stock</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-success/20 to-black text-white border-white/10 transition-all hover:scale-105 cursor-pointer group"
        onClick={() => navigate('/orders')}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-success" />
            <ExternalLink className="h-4 w-4 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">Processed orders</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/20 to-black text-white border-white/10 transition-all hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <div className="h-4 w-4 text-destructive">$</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">Lifetime revenue</p>
        </CardContent>
      </Card>
    </div>
  );
}
