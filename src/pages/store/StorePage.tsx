
import { useState, useEffect } from "react"
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
  
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true)
        
        // Fetch business profile
        const { data: profileData, error: profileError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', businessId)
          .single()
        
        if (profileError) throw profileError
        
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
        
        if (productsError) throw productsError
        
        setBusinessProfile(profileData)
        setProducts(productsData || [])
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
    }
    
    if (businessId) {
      fetchStoreData()
    }
  }, [businessId, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading store...</div>
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
