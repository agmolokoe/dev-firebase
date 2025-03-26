
import { useState, useCallback, memo } from "react"
import { Input } from "@/components/ui/input"
import { Image, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

type ProductImageUploadProps = {
  previewUrl: string | null
  onImageUpload: (url: string) => void
  disabled?: boolean
}

export const ProductImageUpload = memo(function ProductImageUpload({ 
  previewUrl, 
  onImageUpload, 
  disabled 
}: ProductImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      onImageUpload(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, [onImageUpload, toast]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  }, [handleImageUpload]);

  return (
    <div className="relative w-32 h-32 border-2 border-dashed border-[#FFFFFF]/20 rounded-lg overflow-hidden">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Product preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Image className="w-8 h-8 text-[#FFFFFF]/40" />
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={disabled || uploadingImage}
      />
      {uploadingImage && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}
    </div>
  );
})
