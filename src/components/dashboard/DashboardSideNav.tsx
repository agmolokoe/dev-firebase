
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
  Store,
  Globe,
  Sparkles
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
      title: "Webstore",
      href: "/dashboard/webstore",
      icon: <Store className="h-5 w-5 text-teal-400" />,
      active: pathname.startsWith("/dashboard/webstore"),
      highlight: true,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: <Package className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/customers"),
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
      icon: <Globe className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/view-store"),
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <FileText className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/reports"),
    },
    {
      title: "Marketing",
      href: "/dashboard/marketing",
      icon: <Sparkles className="h-5 w-5" />,
      active: pathname.startsWith("/dashboard/marketing"),
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
            "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-foreground relative group",
            link.active 
              ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white" 
              : "hover:bg-white/10",
            link.highlight && "border-l-4 border-teal-400"
          )}
        >
          <span className={cn(
            "absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-600/10 opacity-0 rounded-lg transition-opacity group-hover:opacity-100",
            link.active ? "opacity-0" : ""
          )} />
          <span className="relative z-10 flex items-center gap-2">
            {link.icon}
            <span className="transition-all duration-300">{link.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
