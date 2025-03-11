
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Heart, ChevronLeft, Share2, Star } from "lucide-react"
import { ShareLinks } from "@/components/social/ShareLinks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDetailPage() {
  const { businessId, productId } = useParams<{ businessId: string; productId: string }>()
  const { toast } = useToast()
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
    // This would integrate with a cart system in the future
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
    })
  }
  
  const handleWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist",
    })
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center">
        <div className="animate-pulse">Loading product...</div>
      </div>
    )
  }

  if (!product || !businessProfile) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-[#FFFFFF]/70 mb-6">The product you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF]">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to={`/store/${businessId}`} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {businessProfile.business_name}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Product Detail */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-[#121212] rounded-lg overflow-hidden border border-[#FFFFFF]/10">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#FFFFFF]/30">No image available</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-[#FE2C55]" fill="#FE2C55" />
                ))}
              </div>
              <span className="text-[#FFFFFF]/70">(12 reviews)</span>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold">{formatCurrency(product.selling_price)}</span>
            </div>
            
            <div className="mb-6">
              <p className="text-[#FFFFFF]/80 whitespace-pre-line">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <p className={`${stockStatus.color} font-medium`}>{stockStatus.text}</p>
            </div>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-[#FFFFFF]/20 rounded-md overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-2 bg-[#121212] hover:bg-[#1F1F1F] transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-[#FFFFFF]/20 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-2 bg-[#121212] hover:bg-[#1F1F1F] transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              
              <Button
                variant="default"
                className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="border-[#FFFFFF]/20 hover:bg-[#FFFFFF]/5"
                onClick={handleWishlist}
              >
                <Heart className="h-5 w-5" />
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#FFFFFF]/20 hover:bg-[#FFFFFF]/5"
                  onClick={() => setShowShareLinks(!showShareLinks)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                {showShareLinks && (
                  <div className="absolute right-0 mt-2 p-3 z-10 bg-[#121212] border border-[#FFFFFF]/10 rounded-lg shadow-lg">
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
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-[#121212]">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6 p-6 border border-[#FFFFFF]/10 rounded-lg bg-[#121212]">
            <h3 className="text-xl font-semibold mb-4">Product Description</h3>
            <div className="text-[#FFFFFF]/80 whitespace-pre-line">
              {product.description || "No detailed description available for this product."}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6 p-6 border border-[#FFFFFF]/10 rounded-lg bg-[#121212]">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between border-b border-[#FFFFFF]/10 pb-2">
                <span className="text-[#FFFFFF]/70">Price</span>
                <span>{formatCurrency(product.selling_price)}</span>
              </div>
              <div className="flex justify-between border-b border-[#FFFFFF]/10 pb-2">
                <span className="text-[#FFFFFF]/70">Availability</span>
                <span className={stockStatus.color}>{stockStatus.text}</span>
              </div>
              <div className="flex justify-between border-b border-[#FFFFFF]/10 pb-2">
                <span className="text-[#FFFFFF]/70">ID</span>
                <span>#{product.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#FFFFFF]/10 pb-2">
                <span className="text-[#FFFFFF]/70">Seller</span>
                <span>{businessProfile.business_name}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6 p-6 border border-[#FFFFFF]/10 rounded-lg bg-[#121212]">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            <div className="text-center py-8">
              <p className="text-[#FFFFFF]/70 mb-4">No reviews yet</p>
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
              <div 
                key={relProduct.id} 
                className="bg-[#121212] border border-[#FFFFFF]/10 rounded-lg overflow-hidden hover:border-[#25F4EE]/50 transition-colors"
              >
                <Link to={`/store/${businessId}/product/${relProduct.id}`}>
                  <div className="aspect-square w-full relative overflow-hidden">
                    {relProduct.image_url ? (
                      <img 
                        src={relProduct.image_url} 
                        alt={relProduct.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center">
                        <span className="text-[#FFFFFF]/30">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{relProduct.name}</h3>
                    <p className="text-[#FE2C55] font-semibold">{formatCurrency(relProduct.selling_price)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#FFFFFF]/10">
        <div className="container mx-auto px-4 text-center text-[#FFFFFF]/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {businessProfile.business_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
