import { DashboardLayout } from "@/components/DashboardLayout";

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your orders
        </p>
      </div>
    </DashboardLayout>
  );
}