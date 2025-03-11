
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Heart, ChevronLeft, Share2, Star, Minus, Plus } from "lucide-react"
import { ShareLinks } from "@/components/social/ShareLinks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreNavigation } from "@/components/store/StoreNavigation"
import { ProductCard } from "@/components/store/ProductCard"
import { CartProvider, useCart } from "@/context/CartContext"

function ProductDetail() {
  const { businessId, productId } = useParams<{ businessId: string; productId: string }>()
  const { toast } = useToast()
  const { addItem } = useCart()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showShareLinks, setShowShareLinks] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('business_id', businessId)
          .single()
        
        if (productError) throw productError
        
        // Fetch business profile
        const { data: profileData, error: profileError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', businessId)
          .single()
        
        if (profileError) throw profileError
        
        // Fetch related products (same business, different product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
          .neq('id', productId)
          .limit(4)
        
        if (relatedError) throw relatedError
        
        setProduct(productData)
        setBusinessProfile(profileData)
        setRelatedProducts(relatedData || [])
      } catch (error) {
        console.error("Error fetching product data:", error)
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (businessId && productId) {
      fetchProductData()
    }
  }, [businessId, productId, toast])

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
  }
  
  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading product...</div>
      </div>
    )
  }

  if (!product || !businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to={`/store/${businessId}`}>Back to Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  const stockStatus = product.stock > 10 
    ? { text: "In Stock", color: "text-green-500" }
    : product.stock > 0 
      ? { text: "Low Stock", color: "text-amber-500" }
      : { text: "Out of Stock", color: "text-red-500" };

  // Extract categories for the navigation
  const categories = ['All Products', 'New Arrivals', 'Best Sellers'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Store Navigation */}
      <StoreNavigation 
        businessName={businessProfile.business_name} 
        businessId={businessId || ''} 
        categories={categories} 
      />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild size="sm" className="text-muted-foreground">
          <Link to={`/store/${businessId}`} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to store
          </Link>
        </Button>
      </div>
      
      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-accent/10 rounded-lg overflow-hidden border">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
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
                  disabled={quantity >= product.stock || product.stock <= 0}
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
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Product Description</h3>
            <div className="text-foreground/80 whitespace-pre-line">
              {product.description || "No detailed description available for this product."}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Price</span>
                <span>{formatCurrency(product.selling_price)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Availability</span>
                <span className={stockStatus.color}>{stockStatus.text}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">ID</span>
                <span>#{product.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Seller</span>
                <span>{businessProfile.business_name}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No reviews yet</p>
              <Button variant="outline">Write a review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                id={relProduct.id}
                name={relProduct.name}
                price={relProduct.selling_price}
                image_url={relProduct.image_url}
                description={relProduct.description}
                business_id={relProduct.business_id}
                stock={relProduct.stock}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} {businessProfile.business_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetail />
    </CartProvider>
  );
}
