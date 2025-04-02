
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export async function getById({
  tableName,
  currentTenantId,
  isAdmin,
  id,
  toast,
  setIsLoading,
  setError
}: {
  tableName: string;
  currentTenantId: string | null;
  isAdmin: boolean;
  id: number | string;
  toast: ReturnType<typeof useToast>["toast"];
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}) {
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
    
    const { data, error } = await query.maybeSingle();
    
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
}
