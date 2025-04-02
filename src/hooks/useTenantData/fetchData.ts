
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { PostgrestFilterBuilder } from "@supabase/supabase-js";

export async function fetchData({
  tableName,
  currentTenantId,
  isAdmin,
  toast,
  setIsLoading,
  setError,
  options = {}
}: {
  tableName: string;
  currentTenantId: string | null;
  isAdmin: boolean;
  toast: ReturnType<typeof useToast>["toast"];
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  options?: {
    columns?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
    additionalFilters?: (query: PostgrestFilterBuilder<any, any, unknown>) => any;
  }
}) {
  try {
    setIsLoading(true);
    setError(null);
    
    const { 
      columns = '*', 
      filters = {}, 
      order,
      limit,
      page,
      additionalFilters
    } = options;
    
    // Start with tenant-isolated query
    let query: PostgrestFilterBuilder<any, any, unknown> = supabase.from(tableName).select(columns);
    
    // Apply tenant filter
    if (currentTenantId && (!isAdmin || (isAdmin && currentTenantId))) {
      query = query.eq('business_id', currentTenantId);
    }
    
    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    // Apply custom filter function if provided
    if (additionalFilters) {
      query = additionalFilters(query);
    }
    
    // Apply ordering
    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? false });
    }
    
    // Apply pagination
    if (limit) {
      query = query.limit(limit);
      if (page && page > 1) {
        query = query.range((page - 1) * limit, page * limit - 1);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to load ${tableName}: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }
    
    return data || [];
  } catch (err: any) {
    console.error(`Unexpected error fetching ${tableName}:`, err);
    setError(err.message);
    toast({
      title: "Error",
      description: `Something went wrong while loading data`,
      variant: "destructive",
    });
    return [];
  } finally {
    setIsLoading(false);
  }
}
