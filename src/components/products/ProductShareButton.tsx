
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ShareLinks } from "@/components/social/ShareLinks"
import { db } from "@/lib/supabase"

// Define a proper TypeScript interface for the product
interface ProductShareButtonProps {
  product: {
    id: number
    name: string
    description: string | null
    business_id: string
  }
}

export const ProductShareButton = memo(function ProductShareButton({ product }: ProductShareButtonProps) {
  const [open, setOpen] = useState(false)
  
  // Generate a proper share URL for the product
  const shareUrl = db.getShareUrl(product.business_id, product.id.toString())
  
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen)
  }, [])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#FFFFFF]/70 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share product</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 bg-black border-white/10">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Share product</h4>
          <ShareLinks 
            url={shareUrl}
            title={product.name} 
            description={product.description || "Check out this amazing product!"}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
})
