import { DashboardLayout } from "@/components/DashboardLayout";

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage your product catalog
        </p>
      </div>
    </DashboardLayout>
  );
}