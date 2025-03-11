
import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { supabase } from "@/lib/supabase";

type FeaturedProductsProps = {
  businessId: string;
  limit?: number;
};

export function FeaturedProducts({ businessId, limit = 4 }: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        // Mark some products as featured for demo purposes
        const productsWithFlags = data.map((product, index) => ({
          ...product,
          isFeatured: index < 2,
          isNew: index >= 2
        }));
        
        setProducts(productsWithFlags);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchFeaturedProducts();
    }
  }, [businessId, limit]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="h-[320px] bg-muted rounded"></div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return null;
  }
  
  return (
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
          isNew={product.isNew}
          isFeatured={product.isFeatured}
        />
      ))}
    </div>
  );
}
