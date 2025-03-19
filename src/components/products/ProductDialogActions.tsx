
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./ProductFormFields"

interface ProductDialogActionsProps {
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isEditMode: boolean;
}

export function ProductDialogActions({ 
  isSubmitting,
  onOpenChange,
  form,
  onSubmit,
  isEditMode
}: ProductDialogActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t border-[#FFFFFF]/10 mt-4 bg-black sticky bottom-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
        className="text-[#FFFFFF] border-[#FFFFFF]/10 hover:bg-[#FFFFFF]/5"
      >
        Cancel
      </Button>
      <Button 
        onClick={form.handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEditMode ? (
          "Update"
        ) : (
          "Create"
        )}
      </Button>
    </div>
  );
}
