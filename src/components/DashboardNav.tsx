import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Share2,
  CreditCard
} from "lucide-react"

export function DashboardNav() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="grid items-start gap-2 p-4">
      <Button
        asChild
        variant={isActive("/dashboard") && !isActive("/dashboard/") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <Button
        asChild
        variant={isActive("/dashboard/customers") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/customers">
          <Users className="mr-2 h-4 w-4" />
          Customers
        </Link>
      </Button>
      <Button
        asChild
        variant={isActive("/dashboard/orders") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/orders">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Orders
        </Link>
      </Button>
      <Button
        asChild
        variant={isActive("/dashboard/products") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/products">
          <Package className="mr-2 h-4 w-4" />
          Products
        </Link>
      </Button>
      <Button
        asChild
        variant={isActive("/dashboard/social") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/social">
          <Share2 className="mr-2 h-4 w-4" />
          Social
        </Link>
      </Button>
      <Button
        asChild
        variant={isActive("/dashboard/subscription") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/subscription">
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </Link>
      </Button>
    </nav>
  )
}