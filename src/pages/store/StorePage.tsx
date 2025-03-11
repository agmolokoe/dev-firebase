
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { StoreNavigation } from "@/components/store/StoreNavigation"
import { FeaturedProducts } from "@/components/store/FeaturedProducts"
import { ProductCard } from "@/components/store/ProductCard"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { CartProvider } from "@/context/CartContext"

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
        
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                {businessProfile.logo_url ? (
                  <img 
                    src={businessProfile.logo_url} 
                    alt={businessProfile.business_name} 
                    className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 object-cover border-2 border-primary" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <span className="text-2xl font-bold">
                      {businessProfile.business_name?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
                <h1 className="text-4xl font-bold mb-2">{businessProfile.business_name}</h1>
                <p className="text-muted-foreground max-w-xl">
                  {businessProfile.business_description || "Welcome to our online store."}
                </p>
              </div>
              
              <div className="flex space-x-4">
                {businessProfile.social_media?.instagram && (
                  <a 
                    href={businessProfile.social_media.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {businessProfile.social_media?.facebook && (
                  <a 
                    href={businessProfile.social_media.facebook} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {businessProfile.social_media?.twitter && (
                  <a 
                    href={businessProfile.social_media.twitter} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              {businessProfile.business_address && (
                <div>{businessProfile.business_address}</div>
              )}
              {businessProfile.contact_email && (
                <div>
                  <a href={`mailto:${businessProfile.contact_email}`} className="hover:text-primary">
                    {businessProfile.contact_email}
                  </a>
                </div>
              )}
              {businessProfile.contact_phone && (
                <div>
                  <a href={`tel:${businessProfile.contact_phone}`} className="hover:text-primary">
                    {businessProfile.contact_phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Featured Products */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          {businessId && <FeaturedProducts businessId={businessId} />}
        </section>
        
        {/* All Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">All Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.selling_price}
                  image_url={product.image_url}
                  description={product.description}
                  business_id={product.business_id}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Footer */}
        <footer className="mt-auto py-8 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} {businessProfile.business_name}. All rights reserved.</p>
            {businessProfile.website_url && (
              <a 
                href={businessProfile.website_url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block mt-2 hover:text-primary transition-colors"
              >
                Visit our website
              </a>
            )}
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
