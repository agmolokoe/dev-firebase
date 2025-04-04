import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Package } from "lucide-react"
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
  const [animationComplete, setAnimationComplete] = useState(false)

  const fetchProductData = useCallback(async () => {
    if (!businessId || !productId) return;
    
    try {
      setLoading(true)
      
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

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-[#25F4EE] border-t-transparent animate-spin mb-4"></div>
          <p className="text-white/70 animate-pulse">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product || !businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="h-20 w-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-white/40" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-[#25F4EE] text-black hover:bg-[#25F4EE]/90">
            <Link to={`/shopapp/${businessId}`}>Back to Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  const categories = ['All Products', 'New Arrivals', 'Best Sellers'];

  return (
    <div className={`min-h-screen bg-background flex flex-col opacity-0 ${animationComplete ? 'animate-fade-in opacity-100' : ''}`}>
      <StoreNavigation 
        businessName={businessProfile.business_name} 
        businessId={businessId || ''} 
        categories={categories} 
      />
      
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
          <Link to={`/shopapp/${businessId}`} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to store
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative" 
               style={{
                 animation: animationComplete ? 'slideInFromLeft 0.5s ease-out forwards' : 'none',
                 opacity: 0,
               }}>
            <ProductImages imageUrl={product.image_url} productName={product.name} />
          </div>
          
          <div className="relative"
               style={{
                 animation: animationComplete ? 'slideInFromRight 0.5s ease-out 0.2s forwards' : 'none',
                 opacity: 0,
               }}>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <ProductTabs product={product} businessName={businessProfile.business_name} />
      </div>
      
      <RelatedProducts products={relatedProducts} />
      
      <StoreFooter 
        businessName={businessProfile.business_name}
        websiteUrl={businessProfile.website_url}
      />
      
      <style>
        {`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            transform: translateX(50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        `}
      </style>
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
