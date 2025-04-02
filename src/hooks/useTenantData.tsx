
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/middleware/TenantMiddleware";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { fetchData as fetchDataUtil } from "./useTenantData/fetchData";
import { insertData as insertDataUtil } from "./useTenantData/insertData";
import { updateData as updateDataUtil } from "./useTenantData/updateData";
import { deleteData as deleteDataUtil } from "./useTenantData/deleteData";
import { getById as getByIdUtil } from "./useTenantData/getById";

// A hook to handle data operations with automatic tenant isolation
export function useTenantData(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, isAdmin } = useTenant();
  const { toast } = useToast();

  // Fetch data with automatic tenant filtering
  const fetchData = useCallback(async (options: {
    columns?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
    additionalFilters?: (query: PostgrestFilterBuilder<any, any, unknown>) => any;
  } = {}) => {
    return fetchDataUtil({
      tableName,
      currentTenantId,
      isAdmin,
      toast,
      setIsLoading,
      setError,
      options
    });
  }, [tableName, currentTenantId, isAdmin, toast]);

  // Insert data with automatic tenant assignment
  const insertData = useCallback(async (data: any) => {
    return insertDataUtil({
      tableName,
      currentTenantId,
      data,
      toast,
      setIsLoading, 
      setError
    });
  }, [tableName, currentTenantId, toast]);

  // Update data with tenant verification
  const updateData = useCallback(async (id: number | string, data: any) => {
    return updateDataUtil({
      tableName,
      currentTenantId,
      isAdmin,
      id,
      data,
      toast,
      setIsLoading,
      setError
    });
  }, [tableName, currentTenantId, isAdmin, toast]);

  // Delete data with tenant verification
  const deleteData = useCallback(async (id: number | string) => {
    return deleteDataUtil({
      tableName,
      currentTenantId,
      isAdmin,
      id,
      toast,
      setIsLoading,
      setError
    });
  }, [tableName, currentTenantId, isAdmin, toast]);

  // Get a single record by ID with tenant verification
  const getById = useCallback(async (id: number | string) => {
    return getByIdUtil({
      tableName,
      currentTenantId,
      isAdmin,
      id,
      toast,
      setIsLoading,
      setError
    });
  }, [tableName, currentTenantId, isAdmin, toast]);

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
