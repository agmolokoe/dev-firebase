
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export async function deleteData({
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
}
