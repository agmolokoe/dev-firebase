import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface DashboardSummariesProps {
  orders: any[];
  products: any[];
  customers: any[];
}

export function DashboardSummaries({ orders, products, customers }: DashboardSummariesProps) {
  return (
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
  );
}