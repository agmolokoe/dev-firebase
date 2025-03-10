
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ShareLinks } from "@/components/social/ShareLinks"

interface ProductShareButtonProps {
  product: {
    id: number
    name: string
    description: string | null
  }
}

export function ProductShareButton({ product }: ProductShareButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            title={product.name} 
            description={product.description || ""}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
