
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image_url?: string | null;
  description?: string | null;
  business_id: string;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
};

export function ProductCard({
  id,
  name,
  price,
  image_url,
  description,
  business_id,
  stock = 0,
  isNew = false,
  isFeatured = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock <= 0) return;
    
    addItem({
      id,
      name,
      price,
      image_url,
      business_id,
    });
  };
  
  return (
    <Card className="group overflow-hidden">
      <Link to={`/store/${business_id}/product/${id}`} className="relative block">
        <div className="aspect-square overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              New
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Featured
            </Badge>
          )}
          {stock <= 0 && (
            <Badge variant="destructive">
              Out of stock
            </Badge>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2 mt-2">
          <Link 
            to={`/store/${business_id}/product/${id}`}
            className="font-medium hover:underline truncate block"
          >
            {name}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {description || "No description available"}
          </p>
        </div>
        <div className="font-semibold">{formatCurrency(price)}</div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          size="sm"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
