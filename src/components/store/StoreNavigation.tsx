
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "./ShoppingCart";
import { Search, Menu, Heart, Home, Package, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 ${
        scrolled ? 'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-white/10' : 'bg-background border-transparent'
      }`}
    >
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group">
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r border-white/10 bg-black/95 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <Link to={`/shopapp/${businessId}`} className="text-xl font-bold gradient-text">
                {businessName}
              </Link>
            </div>
            <nav className="flex flex-col gap-4">
              <Link to={`/shopapp/${businessId}`} className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/5 transition-colors">
                <Home className="h-5 w-5 text-[#25F4EE]" />
                <span className="font-medium">Home</span>
              </Link>
              
              {categories.map((category) => (
                <Link 
                  key={category} 
                  to={`/shopapp/${businessId}/category/${category}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/5 transition-colors"
                >
                  <Package className="h-5 w-5 text-[#FE2C55]" />
                  <span>{category}</span>
                </Link>
              ))}
              
              <div className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="w-full pl-10 bg-white/5 border-white/10 focus:border-[#25F4EE]"
                  />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Link to={`/shopapp/${businessId}`} className="flex items-center gap-2 group">
            <span className="font-bold text-xl relative">
              {businessName}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </Link>
        </div>
        
        <nav className="mx-6 hidden items-center space-x-1 md:flex md:flex-1">
          <Link 
            to={`/shopapp/${businessId}`} 
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5 transition-colors flex items-center space-x-2"
          >
            <Home className="h-4 w-4 text-[#25F4EE]" />
            <span>Home</span>
          </Link>
          
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/shopapp/${businessId}/category/${category}`}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5 transition-colors"
            >
              {category}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <div 
            className={`hidden md:flex relative transition-all duration-300 ${
              searchFocused ? 'w-[300px]' : 'w-[200px] lg:w-[250px]'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 bg-black/50 border-white/10 focus:border-[#25F4EE] transition-all duration-300"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/5"
          >
            <Heart className="h-5 w-5 text-white/70 hover:text-[#FE2C55] transition-colors" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/5"
          >
            <Bell className="h-5 w-5 text-white/70 hover:text-[#25F4EE] transition-colors" />
            <span className="absolute -top-1 -right-1 bg-[#FE2C55] text-white text-xs h-4 w-4 flex items-center justify-center rounded-full">2</span>
          </Button>
          
          <ShoppingCart />
        </div>
      </div>
    </header>
  );
}
