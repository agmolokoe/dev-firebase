
import { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useProductData() {
  const [userId, setUserId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Check user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking auth session...")
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id || null
        setUserId(currentUserId)
        console.log("Auth session check complete. User ID:", currentUserId || "not logged in")
        
        if (!currentUserId) {
          console.warn("No user is authenticated")
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view products",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking session:", error)
        toast({
          title: "Error",
          description: "Failed to verify authentication",
          variant: "destructive",
        })
      }
    }
    
    checkSession()
    
    // Subscribe to auth changes
    console.log("Setting up auth state change listener")
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed. Event:", event)
      const currentUserId = session?.user?.id || null
      setUserId(currentUserId)
    })
    
    return () => {
      console.log("Cleaning up auth state change listener")
      authListener?.subscription.unsubscribe()
    }
  }, [toast])
  
  const setSearchTermCallback = useCallback((term: string) => {
    console.log("Search term updated:", term)
    setSearchTerm(term);
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', userId],
    queryFn: async () => {
      if (!userId) return []
      
      try {
        console.log("Fetching products for user ID:", userId)
        const startTime = performance.now()
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', userId)
          .order('created_at', { ascending: false })
        
        const endTime = performance.now()
        console.log(`Products fetch completed in ${(endTime - startTime).toFixed(2)}ms`)
        
        if (error) {
          console.error("Supabase error fetching products:", error)
          throw error
        }
        
        console.log(`Retrieved ${data?.length || 0} products`)
        return data || []
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
        return []
      }
    },
    enabled: !!userId,
  })

  const filteredProducts = useMemo(() => {
    console.log(`Filtering ${products.length} products with search term: "${searchTerm}"`)
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    console.log(`Filter complete. Showing ${filtered.length} products`)
    return filtered
  }, [products, searchTerm])

  // Calculate product stats with memoization
  const stats = useMemo(() => {
    console.log("Calculating product statistics...")
    const startTime = performance.now()
    
    const totalValue = products.reduce((sum, product) => 
      sum + (product.cost_price * (product.stock || 0)), 0
    );
    
    const totalProfit = products.reduce((sum, product) => 
      sum + ((product.selling_price - product.cost_price) * (product.stock || 0)), 0
    );
    
    const totalProducts = products.length;
    const lowStockProducts = products.filter((product) => (product.stock || 0) < 10).length;

    const endTime = performance.now()
    console.log(`Statistics calculation completed in ${(endTime - startTime).toFixed(2)}ms`)

    return {
      totalProducts,
      totalValue,
      totalProfit,
      lowStockProducts
    };
  }, [products]);

  return {
    userId,
    products: filteredProducts,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm: setSearchTermCallback
  }
}
