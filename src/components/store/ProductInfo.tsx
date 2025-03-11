
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ShareLinks } from "@/components/social/ShareLinks"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"

type ProductInfoProps = {
  product: {
    id: number;
    name: string;
    selling_price: number;
    description?: string;
    stock?: number;
    business_id: string;
    image_url?: string;
  };
};

export function ProductInfo({ product }: ProductInfoProps) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showShareLinks, setShowShareLinks] = useState(false)

  const stockStatus = product.stock > 10 
    ? { text: "In Stock", color: "text-green-500" }
    : product.stock > 0 
      ? { text: "Low Stock", color: "text-amber-500" }
      : { text: "Out of Stock", color: "text-red-500" };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.selling_price,
      image_url: product.image_url,
      business_id: product.business_id,
    });
    
    toast({
      title: `${quantity} item${quantity > 1 ? 's' : ''} added to cart`,
      description: `${product.name} has been added to your cart`
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} className="h-5 w-5 text-primary" fill="currentColor" />
          ))}
        </div>
        <span className="text-muted-foreground">(12 reviews)</span>
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold">{formatCurrency(product.selling_price)}</span>
      </div>
      
      <div className="mb-6">
        <p className="text-foreground/80 whitespace-pre-line">{product.description}</p>
      </div>
      
      <div className="mb-6">
        <p className={`${stockStatus.color} font-medium`}>{stockStatus.text}</p>
      </div>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="rounded-none h-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 border-x min-w-[40px] text-center">
            {quantity}
          </span>
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= (product.stock || 0) || (product.stock || 0) <= 0}
            className="rounded-none h-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="default"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setShowShareLinks(!showShareLinks)}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          {showShareLinks && (
            <div className="absolute right-0 mt-2 p-3 z-10 bg-background border rounded-lg shadow-lg">
              <div className="mb-2 text-sm font-medium">Share this product</div>
              <ShareLinks 
                title={product.name}
                description={product.description || ""}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
