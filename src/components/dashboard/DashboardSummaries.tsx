
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummariesProps {
  orders?: any[];
  products?: any[];
  customers?: any[];
  isLoading: boolean;
}

export function DashboardSummaries({ orders = [], products = [], customers = [], isLoading }: DashboardSummariesProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-black text-white border-white/10">
            <CardHeader>
              <Skeleton className="h-6 w-1/2 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3 bg-gray-800" />
                    <Skeleton className="h-4 w-1/4 bg-gray-800" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center">
                  <span>Order #{order.id}</span>
                  <span>{formatCurrency(order.total_amount || 0)}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-2">No recent orders</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.length > 0 ? (
              products
                .filter(product => (product.stock || 0) < 10)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span>{product.stock} in stock</span>
                  </div>
                ))
            ) : (
              <div className="text-center text-muted-foreground py-2">No low stock products</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {customers.length > 0 ? (
              customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex justify-between items-center">
                  <span>{customer.name}</span>
                  <span className="text-muted-foreground">{customer.email}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-2">No recent customers</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
