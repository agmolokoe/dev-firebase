
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Share2,
  CreditCard,
  Store,
  Building2,
  BarChart4,
  Shield
} from "lucide-react"

interface DashboardNavProps {
  isAdmin?: boolean;
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="grid items-start gap-2 p-4">
      {/* Admin section */}
      {isAdmin && (
        <>
          <div className="px-2 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-primary">Admin</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={isActive("/admin/businesses") ? "secondary" : "ghost"}
                className="justify-start w-full"
              >
                <Link to="/admin/businesses">
                  <Building2 className="mr-2 h-4 w-4" />
                  Businesses
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/admin/analytics") ? "secondary" : "ghost"}
                className="justify-start w-full"
              >
                <Link to="/admin/analytics">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Platform Analytics
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/admin/settings") ? "secondary" : "ghost"}
                className="justify-start w-full"
              >
                <Link to="/admin/settings">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Settings
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="px-3 py-2">
            <div className="h-[1px] w-full bg-gray-800 mb-2" />
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Business</h2>
          </div>
        </>
      )}
      
      {/* Standard business navigation */}
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
      <Button
        asChild
        variant={isActive("/dashboard/view-store") ? "secondary" : "ghost"}
        className="justify-start"
      >
        <Link to="/dashboard/view-store">
          <Store className="mr-2 h-4 w-4" />
          View Store
        </Link>
      </Button>
    </nav>
  )
}
