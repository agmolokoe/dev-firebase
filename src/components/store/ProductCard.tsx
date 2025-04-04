
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Share2, ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShareLinks } from "@/components/social/ShareLinks";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [showShare, setShowShare] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  
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
    
    // Animate button click
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 500);
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    });
  };
  
  return (
    <Card 
      className="group overflow-hidden transition-all duration-500 hover:shadow-lg border-white/10 bg-gradient-to-b from-black to-[#121212] h-full flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/store/${business_id}/product/${id}`} className="relative block">
        <div className="aspect-square overflow-hidden bg-black">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className={`h-full w-full object-cover transition-all duration-700 ${isHovering ? 'scale-110 brightness-110' : 'scale-100'}`}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-black/50">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {/* Overlay gradient on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
        </div>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge variant="secondary" className="bg-[#25F4EE] text-black font-semibold animate-pulse">
              NEW
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="secondary" className="bg-[#FE2C55] text-white font-semibold">
              FEATURED
            </Badge>
          )}
          {stock <= 0 && (
            <Badge variant="destructive" className="animate-pulse">
              Out of stock
            </Badge>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className={`h-8 w-8 rounded-full transition-all duration-500 ${
              isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            } bg-white/20 backdrop-blur-md hover:bg-white/40`}
          >
            <Heart className="h-4 w-4 text-white" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          
          <Popover open={showShare} onOpenChange={setShowShare}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`h-8 w-8 rounded-full transition-all duration-500 delay-100 ${
                  isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                } bg-white/20 backdrop-blur-md hover:bg-white/40`}
              >
                <Share2 className="h-4 w-4 text-white" />
                <span className="sr-only">Share product</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-black/95 backdrop-blur-md border-white/10">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Share product</h4>
                <ShareLinks 
                  title={name} 
                  description={description || "Check out this amazing product!"}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Rating preview */}
        <div 
          className={`absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md transition-all duration-500 ${
            isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-3 w-3 text-[#FE2C55] fill-[#FE2C55]" 
              />
            ))}
            <span className="text-xs text-white ml-1">(5.0)</span>
          </div>
        </div>

        {/* Price tag that slides in on hover */}
        <div 
          className={`absolute bottom-2 right-2 bg-[#FE2C55] text-white font-bold px-3 py-1 rounded-md transition-all duration-500 ${
            isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {formatCurrency(price)}
        </div>
      </Link>
      
      <CardContent className="p-4 flex-grow">
        <div className="mb-2 mt-2">
          <Link 
            to={`/store/${business_id}/product/${id}`}
            className="font-semibold hover:text-[#25F4EE] transition-colors truncate block text-lg"
          >
            {name}
          </Link>
          <p className="text-sm text-white/60 line-clamp-2 h-10 mt-1">
            {description || "No description available"}
          </p>
        </div>
        <div className="font-bold text-xl text-white">{formatCurrency(price)}</div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className={`w-full relative overflow-hidden transition-all duration-300 ${
            buttonClicked ? 'animate-shake' : ''
          } ${
            stock <= 0 ? 'bg-[#333] text-white/50' : 'bg-[#FE2C55] hover:bg-[#FE2C55]/80 text-white'
          }`}
          size="lg"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          {/* Button background animation */}
          <div 
            className={`absolute inset-0 bg-white/20 transform ${
              buttonClicked ? 'scale-x-100' : 'scale-x-0'
            } transition-transform duration-500 origin-left`}
          ></div>
          
          <ShoppingCart className={`mr-2 h-4 w-4 transition-transform duration-300 ${
            buttonClicked ? 'scale-110' : 'scale-100'
          }`} />
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
