
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "./ShoppingCart";
import { Search, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type StoreNavigationProps = {
  businessName: string;
  businessId: string;
  categories?: string[];
};

export function StoreNavigation({ 
  businessName, 
  businessId,
  categories = [] 
}: StoreNavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to={`/store/${businessId}`} className="text-lg font-semibold">
                Home
              </Link>
              {categories.map((category) => (
                <Link 
                  key={category} 
                  to={`/store/${businessId}/category/${category}`}
                  className="text-lg"
                >
                  {category}
                </Link>
              ))}
              <div className="pt-4">
                <Input placeholder="Search products..." className="w-full" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Link to={`/store/${businessId}`} className="flex items-center gap-2">
            <span className="font-bold text-xl">{businessName}</span>
          </Link>
        </div>
        
        <nav className="mx-6 hidden items-center space-x-4 md:flex md:flex-1">
          <Link to={`/store/${businessId}`} className="text-sm font-medium">
            Home
          </Link>
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/store/${businessId}/category/${category}`}
              className="text-sm font-medium"
            >
              {category}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px] lg:w-[300px] pl-8"
            />
          </div>
          
          <ShoppingCart />
        </div>
      </div>
    </header>
  );
}
