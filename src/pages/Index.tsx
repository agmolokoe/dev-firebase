import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    name: "Total Customers",
    value: "2,100",
    icon: Users,
    change: "+4.75%",
    changeType: "positive",
  },
  {
    name: "Orders This Month",
    value: "156",
    icon: ShoppingCart,
    change: "+54.02%",
    changeType: "positive",
  },
  {
    name: "Products in Stock",
    value: "89",
    icon: Package,
    change: "-1.39%",
    changeType: "negative",
  },
  {
    name: "Revenue",
    value: "$12,545",
    icon: TrendingUp,
    change: "+10.18%",
    changeType: "positive",
  },
];

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back! Here's an overview of your business.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <span
                      className={`text-sm ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="mt-2 text-sm text-gray-600">
              Coming soon: View your recent orders, customer interactions, and
              inventory changes here.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}