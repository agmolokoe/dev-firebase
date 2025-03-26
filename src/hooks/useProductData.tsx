
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
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id || null
        setUserId(currentUserId)
        
        if (!currentUserId) {
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUserId = session?.user?.id || null
      setUserId(currentUserId)
    })
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [toast])
  
  const setSearchTermCallback = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', userId],
    queryFn: async () => {
      if (!userId) return []
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
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

  const filteredProducts = useMemo(() => 
    products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [products, searchTerm]
  );

  // Calculate product stats with memoization
  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, product) => 
      sum + (product.cost_price * (product.stock || 0)), 0
    );
    
    const totalProfit = products.reduce((sum, product) => 
      sum + ((product.selling_price - product.cost_price) * (product.stock || 0)), 0
    );
    
    const totalProducts = products.length;
    const lowStockProducts = products.filter((product) => (product.stock || 0) < 10).length;

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
