import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Share2,
} from "lucide-react"

export function DashboardNav() {
  const location = useLocation()

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
  ]

  return (
    <nav className="grid items-start gap-2 p-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
        >
          <Button
            variant={location.pathname === route.href ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}