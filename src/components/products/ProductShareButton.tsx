
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { db } from "@/lib/supabase"
import { Product } from "./ProductForm"
import { useToast } from "@/hooks/use-toast"

interface ProductShareButtonProps {
  product: Product
}

export const ProductShareButton = memo(function ProductShareButton({ product }: ProductShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const { toast } = useToast()
  
  const generateShareUrl = useCallback(async () => {
    try {
      console.log("Generating share URL for product:", product.id)
      setIsLoading(true)
      
      // Get the share URL from the utility function
      const url = await db.getShareUrl(product.business_id, product.id)
      console.log("Generated share URL:", url)
      
      setShareUrl(url)
      return url
    } catch (error) {
      console.error("Error generating share URL:", error)
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [product.id, product.business_id, toast])
  
  const copyToClipboard = useCallback(async () => {
    try {
      // Generate URL if not already available
      const url = shareUrl || await generateShareUrl()
      if (!url) return
      
      await navigator.clipboard.writeText(url)
      console.log("Share URL copied to clipboard:", url)
      
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard!",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }, [shareUrl, generateShareUrl, toast])
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-[#FFFFFF]/70 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5"
          onClick={(e) => {
            e.preventDefault()
            console.log("Share button clicked for product:", product.id)
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-[#000000] border-[#FFFFFF]/10">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-[#FFFFFF]">Share Product</h4>
          <p className="text-xs text-[#FFFFFF]/70">
            Copy the link to share this product directly
          </p>
          <div className="flex mt-2">
            <Button 
              className="w-full bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white"
              onClick={copyToClipboard}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Copy Link"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})
