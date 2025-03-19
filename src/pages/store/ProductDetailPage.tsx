
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { StoreNavigation } from "@/components/store/StoreNavigation"
import { CartProvider } from "@/context/CartContext"
import { ProductImages } from "@/components/store/ProductImages"
import { ProductInfo } from "@/components/store/ProductInfo"
import { ProductTabs } from "@/components/store/ProductTabs"
import { RelatedProducts } from "@/components/store/RelatedProducts"
import { StoreFooter } from "@/components/store/StoreFooter"

function ProductDetail() {
  const { businessId, productId } = useParams<{ businessId: string; productId: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

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
            <Link to={`/shopapp/${businessId}`}>Back to Store</Link>
          </Button>
        </div>
      </div>
    )
  }

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
          <Link to={`/shopapp/${businessId}`} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to store
          </Link>
        </Button>
      </div>
      
      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductImages imageUrl={product.image_url} productName={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="container mx-auto px-4 py-12">
        <ProductTabs product={product} businessName={businessProfile.business_name} />
      </div>
      
      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
      
      {/* Footer */}
      <StoreFooter 
        businessName={businessProfile.business_name}
        websiteUrl={businessProfile.website_url}
      />
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
