
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  MessageSquare,
  Share2,
  Store
} from "lucide-react";

export function DashboardSideNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/customers"),
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: <Package className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/orders"),
    },
    {
      title: "Social Marketing",
      href: "/dashboard/social",
      icon: <Share2 className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/social"),
    },
    {
      title: "View Store",
      href: "/dashboard/view-store",
      icon: <Store className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/view-store"),
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <FileText className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/reports"),
    },
    {
      title: "Support",
      href: "/dashboard/support",
      icon: <MessageSquare className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/support"),
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <nav className="grid gap-2 px-2">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-foreground",
            link.active ? "bg-secondary" : "hover:bg-secondary/20"
          )}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
