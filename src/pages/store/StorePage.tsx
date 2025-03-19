
import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { StoreNavigation } from "@/components/store/StoreNavigation"
import { FeaturedProducts } from "@/components/store/FeaturedProducts"
import { CartProvider } from "@/context/CartContext"
import { StoreHeader } from "@/components/store/StoreHeader"
import { StoreProductList } from "@/components/store/StoreProductList"
import { StoreFooter } from "@/components/store/StoreFooter"

export default function StorePage() {
  const { businessId } = useParams<{ businessId: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  
  const fetchStoreData = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true)
      
      // Fetch both business profile and products in parallel
      const [profileResponse, productsResponse] = await Promise.all([
        supabase
          .from('business_profiles')
          .select('*')
          .eq('id', businessId)
          .single(),
        
        supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
      ]);
      
      if (profileResponse.error) throw profileResponse.error;
      if (productsResponse.error) throw productsResponse.error;
      
      setBusinessProfile(profileResponse.data);
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error("Error fetching store data:", error)
      toast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [businessId, toast]);
  
  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Extract categories (for demo, we'll create some mock categories)
  const categories = ['All Products', 'New Arrivals', 'Best Sellers'];

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Store Navigation */}
        <StoreNavigation 
          businessName={businessProfile.business_name} 
          businessId={businessId || ''} 
          categories={categories} 
        />
        
        {/* Store Header with Business Info */}
        <StoreHeader businessProfile={businessProfile} />
        
        {/* Featured Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          {businessId && <FeaturedProducts businessId={businessId} />}
        </section>
        
        {/* All Products Section */}
        <StoreProductList 
          products={products} 
          title="All Products" 
        />
        
        {/* Store Footer */}
        <StoreFooter 
          businessName={businessProfile.business_name} 
          websiteUrl={businessProfile.website_url}
        />
      </div>
    </CartProvider>
  )
}
