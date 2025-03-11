
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Instagram, Facebook, Twitter } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function StorePage() {
  const { businessId } = useParams<{ businessId: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [businessProfile, setBusinessProfile] = useState<any>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

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

  const handleAddToCart = (productId: number) => {
    // This would integrate with a cart system in the future
    setSelectedProductId(productId)
    toast({
      title: "Added to cart",
      description: "This product has been added to your cart",
    })
  }
  
  const handleWishlist = (productId: number) => {
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center">
        <div className="animate-pulse">Loading store...</div>
      </div>
    )
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <p className="text-[#FFFFFF]/70">The store you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF]">
      {/* Store Header */}
      <div className="w-full bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              {businessProfile.logo_url ? (
                <img 
                  src={businessProfile.logo_url} 
                  alt={businessProfile.business_name} 
                  className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 object-cover border-2 border-[#25F4EE]" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full mb-4 mx-auto md:mx-0 bg-[#25F4EE]/20 flex items-center justify-center border-2 border-[#25F4EE]">
                  <span className="text-2xl font-bold">
                    {businessProfile.business_name?.charAt(0) || "S"}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-bold mb-2">{businessProfile.business_name}</h1>
              <p className="text-[#FFFFFF]/70 max-w-xl">{businessProfile.business_description || "Welcome to our online store."}</p>
            </div>
            
            <div className="flex space-x-4">
              {businessProfile.social_media?.instagram && (
                <a 
                  href={businessProfile.social_media.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center hover:bg-[#FFFFFF]/20 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {businessProfile.social_media?.facebook && (
                <a 
                  href={businessProfile.social_media.facebook} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center hover:bg-[#FFFFFF]/20 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {businessProfile.social_media?.twitter && (
                <a 
                  href={businessProfile.social_media.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center hover:bg-[#FFFFFF]/20 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#FFFFFF]/70">
            {businessProfile.business_address && (
              <div>{businessProfile.business_address}</div>
            )}
            {businessProfile.contact_email && (
              <div>
                <a href={`mailto:${businessProfile.contact_email}`} className="hover:text-[#25F4EE]">
                  {businessProfile.contact_email}
                </a>
              </div>
            )}
            {businessProfile.contact_phone && (
              <div>
                <a href={`tel:${businessProfile.contact_phone}`} className="hover:text-[#25F4EE]">
                  {businessProfile.contact_phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Products</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#FFFFFF]/70">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-[#121212] border-[#FFFFFF]/10 overflow-hidden hover:border-[#25F4EE]/50 transition-colors">
                <div className="aspect-square w-full relative overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center">
                      <span className="text-[#FFFFFF]/30">No image</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50"
                    onClick={() => handleWishlist(product.id)}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-[#FFFFFF]/70 line-clamp-2">{product.description}</p>
                  <p className="mt-3 text-xl font-semibold text-[#FFFFFF]">{formatCurrency(product.selling_price)}</p>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-[#FE2C55] hover:bg-[#FE2C55]/90 transition-colors"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#FFFFFF]/10">
        <div className="container mx-auto px-4 text-center text-[#FFFFFF]/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {businessProfile.business_name}. All rights reserved.</p>
          {businessProfile.website_url && (
            <a 
              href={businessProfile.website_url} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-2 hover:text-[#25F4EE] transition-colors"
            >
              Visit our website
            </a>
          )}
        </div>
      </footer>
    </div>
  )
}
