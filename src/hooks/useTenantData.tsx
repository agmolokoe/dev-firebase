
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/middleware/TenantMiddleware";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

// A hook to handle data operations with automatic tenant isolation
export function useTenantData(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, isAdmin } = useTenant();
  const { toast } = useToast();

  // Create a query builder with tenant isolation
  const getQueryBuilder = useCallback(() => {
    const query = supabase.from(tableName);
    
    // Only add tenant filter if not admin or if admin has selected a specific tenant
    if (currentTenantId && (!isAdmin || (isAdmin && currentTenantId))) {
      return query.eq('business_id', currentTenantId);
    }
    
    return query;
  }, [tableName, currentTenantId, isAdmin]);

  // Fetch data with automatic tenant filtering
  const fetchData = useCallback(async (options: {
    columns?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
    additionalFilters?: (query: PostgrestFilterBuilder<any, any, unknown>) => any;
  } = {}) => {
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
      let query = getQueryBuilder().select(columns);
      
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
  }, [getQueryBuilder, tableName, toast]);

  // Insert data with automatic tenant assignment
  const insertData = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure business_id is set to the current tenant
      const dataWithTenant = {
        ...data,
        business_id: currentTenantId
      };
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(dataWithTenant)
        .select();
      
      if (error) {
        console.error(`Error inserting into ${tableName}:`, error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to create ${tableName}: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      toast({
        title: "Success",
        description: `Successfully created new entry`,
      });
      
      return result;
    } catch (err: any) {
      console.error(`Unexpected error inserting into ${tableName}:`, err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Something went wrong while saving data`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentTenantId, tableName, toast]);

  // Update data with tenant verification
  const updateData = useCallback(async (id: number | string, data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if the record belongs to the current tenant
      if (!isAdmin) {
        const { data: existingRecord, error: fetchError } = await supabase
          .from(tableName)
          .select('business_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error(`Error verifying ownership for ${tableName}:`, fetchError);
          setError(fetchError.message);
          toast({
            title: "Error",
            description: `Failed to verify item ownership: ${fetchError.message}`,
            variant: "destructive",
          });
          return null;
        }
        
        if (existingRecord.business_id !== currentTenantId) {
          const securityError = "You don't have permission to update this item";
          console.error(`Security violation: ${securityError}`);
          setError(securityError);
          toast({
            title: "Access Denied",
            description: securityError,
            variant: "destructive",
          });
          return null;
        }
      }
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to update: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      toast({
        title: "Success",
        description: `Successfully updated item`,
      });
      
      return result;
    } catch (err: any) {
      console.error(`Unexpected error updating ${tableName}:`, err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Something went wrong while updating data`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentTenantId, isAdmin, tableName, toast]);

  // Delete data with tenant verification
  const deleteData = useCallback(async (id: number | string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if the record belongs to the current tenant
      if (!isAdmin) {
        const { data: existingRecord, error: fetchError } = await supabase
          .from(tableName)
          .select('business_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error(`Error verifying ownership for ${tableName}:`, fetchError);
          setError(fetchError.message);
          toast({
            title: "Error",
            description: `Failed to verify item ownership: ${fetchError.message}`,
            variant: "destructive",
          });
          return false;
        }
        
        if (existingRecord.business_id !== currentTenantId) {
          const securityError = "You don't have permission to delete this item";
          console.error(`Security violation: ${securityError}`);
          setError(securityError);
          toast({
            title: "Access Denied",
            description: securityError,
            variant: "destructive",
          });
          return false;
        }
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to delete: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: `Successfully deleted item`,
      });
      
      return true;
    } catch (err: any) {
      console.error(`Unexpected error deleting from ${tableName}:`, err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Something went wrong while deleting data`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentTenantId, isAdmin, tableName, toast]);

  // Get a single record by ID with tenant verification
  const getById = useCallback(async (id: number | string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('id', id);
      
      // Add tenant filter for non-admins
      if (!isAdmin && currentTenantId) {
        query = query.eq('business_id', currentTenantId);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        // Only show error if it's not a not-found situation for security reasons
        const isForbidden = !isAdmin && error.code !== 'PGRST116';
        
        if (isForbidden) {
          console.error(`Security error fetching ${tableName}:`, error);
          setError("Access denied");
          toast({
            title: "Access Denied",
            description: `You don't have permission to view this item`,
            variant: "destructive",
          });
        } else if (error.code !== 'PGRST116') {
          console.error(`Error fetching ${tableName}:`, error);
          setError(error.message);
          toast({
            title: "Error",
            description: `Failed to load item: ${error.message}`,
            variant: "destructive",
          });
        }
        return null;
      }
      
      return data;
    } catch (err: any) {
      console.error(`Unexpected error fetching single ${tableName}:`, err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Something went wrong while loading data`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentTenantId, isAdmin, tableName, toast]);

  return {
    fetchData,
    insertData,
    updateData,
    deleteData,
    getById,
    isLoading,
    error
  };
}
