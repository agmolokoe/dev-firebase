
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export async function insertData({
  tableName,
  currentTenantId,
  data,
  toast,
  setIsLoading,
  setError
}: {
  tableName: string;
  currentTenantId: string | null;
  data: any;
  toast: ReturnType<typeof useToast>["toast"];
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}) {
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
}
