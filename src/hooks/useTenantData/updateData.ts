
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export async function updateData({
  tableName,
  currentTenantId,
  isAdmin,
  id,
  data,
  toast,
  setIsLoading,
  setError
}: {
  tableName: string;
  currentTenantId: string | null;
  isAdmin: boolean;
  id: number | string;
  data: any;
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
}
