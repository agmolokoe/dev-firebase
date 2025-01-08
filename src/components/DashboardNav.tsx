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
                ? "bg-white text-black"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <route.icon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                location.pathname === route.href
                  ? "text-black"
                  : "text-white/60 group-hover:text-white"
              )}
            />
            <span>{route.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}