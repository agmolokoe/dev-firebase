import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Share2,
} from "lucide-react";

export function DashboardNav() {
  const location = useLocation();

  const routes = [
    {
      href: "/",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      href: "/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/social",
      label: "Social Media",
      icon: Share2,
    },
  ];

  return (
    <nav className="space-y-1 p-4">
      {routes.map((route) => (
        <Link key={route.href} to={route.href}>
          <div
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === route.href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <route.icon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                location.pathname === route.href
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-500"
              )}
            />
            <span>{route.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}