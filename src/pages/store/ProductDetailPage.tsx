
import { useState, useEffect, useCallback } from "react"
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

  const fetchProductData = useCallback(async () => {
    if (!businessId || !productId) return;
    
    try {
      setLoading(true)
      
      // Perform all fetches in parallel for better performance
      const [productResponse, profileResponse, relatedResponse] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('business_id', businessId)
          .single(),
        
        supabase
          .from('business_profiles')
          .select('*')
          .eq('id', businessId)
          .single(),
        
        supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
          .neq('id', productId)
          .limit(4)
      ]);
      
      if (productResponse.error) throw productResponse.error;
      if (profileResponse.error) throw profileResponse.error;
      if (relatedResponse.error) throw relatedResponse.error;
      
      setProduct(productResponse.data);
      setBusinessProfile(profileResponse.data);
      setRelatedProducts(relatedResponse.data || []);
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
  }, [businessId, productId, toast]);
  
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
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
