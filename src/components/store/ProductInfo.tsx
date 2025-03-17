
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck, ShieldCheck, Award } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ShareLinks } from "@/components/social/ShareLinks"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

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
    ? { text: "In Stock", color: "text-green-500", badge: "bg-green-500/20 text-green-500" }
    : product.stock > 0 
      ? { text: "Low Stock", color: "text-amber-500", badge: "bg-amber-500/20 text-amber-500" }
      : { text: "Out of Stock", color: "text-red-500", badge: "bg-red-500/20 text-red-500" };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.selling_price,
        image_url: product.image_url,
        business_id: product.business_id,
      });
    }
    
    toast({
      title: `${quantity} item${quantity > 1 ? 's' : ''} added to cart`,
      description: `${product.name} has been added to your cart`
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Badge className={stockStatus.badge}>{stockStatus.text}</Badge>
          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-sm text-amber-500">Only {product.stock} left!</span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-[#FE2C55]" fill="currentColor" />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">(12 reviews)</span>
        </div>
      </div>
      
      <div className="flex items-baseline space-x-3">
        <span className="text-4xl font-bold text-white">{formatCurrency(product.selling_price)}</span>
        <span className="text-lg line-through text-muted-foreground">
          {formatCurrency(product.selling_price * 1.2)}
        </span>
        <Badge className="bg-[#FE2C55] text-white ml-2 px-2 py-1">SAVE 20%</Badge>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-foreground/80 whitespace-pre-line text-base">{product.description}</p>
      </div>
      
      <div className="border-t border-b border-white/10 py-4 grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-[#25F4EE]" />
          <span className="text-sm">Free Shipping</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-[#25F4EE]" />
          <span className="text-sm">Secure Checkout</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-[#25F4EE]" />
          <span className="text-sm">Quality Guarantee</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md overflow-hidden bg-black/50 border-white/20">
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="rounded-none h-10 hover:bg-black/50"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-6 py-2 min-w-[40px] text-center font-medium">
            {quantity}
          </span>
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= (product.stock || 0) || (product.stock || 0) <= 0}
            className="rounded-none h-10 hover:bg-black/50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="default"
          size="lg"
          className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/80 text-white transition-all shadow-lg hover:shadow-xl"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full border-white/20 hover:bg-white/10"
        >
          <Heart className="h-5 w-5 text-[#FE2C55]" />
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-white/20 hover:bg-white/10"
            onClick={() => setShowShareLinks(!showShareLinks)}
          >
            <Share2 className="h-5 w-5 text-[#25F4EE]" />
          </Button>
          
          {showShareLinks && (
            <div className="absolute right-0 mt-2 p-4 z-10 bg-black border border-white/10 rounded-lg shadow-lg">
              <div className="mb-3 text-sm font-medium">Share this product</div>
              <ShareLinks 
                title={product.name}
                description={product.description || ""}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold mb-3">Why shop with us?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <ShieldCheck className="h-6 w-6 text-[#25F4EE] flex-shrink-0" />
            <div>
              <h4 className="font-medium">Security Guaranteed</h4>
              <p className="text-sm text-muted-foreground">Our secure checkout keeps your data safe</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <Truck className="h-6 w-6 text-[#25F4EE] flex-shrink-0" />
            <div>
              <h4 className="font-medium">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Get your products delivered in days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
