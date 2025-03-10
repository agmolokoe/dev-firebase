
import { Facebook, Instagram, Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface ShareLinksProps {
  url?: string
  title?: string
  description?: string
}

export function ShareLinks({ url, title, description }: ShareLinksProps) {
  // Use the current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Check out this product!'
  const shareDescription = description || 'I found this amazing product I thought you might like.'
  
  const handleShare = (platform: string) => {
    let shareLink = ''
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`
        break
      case 'instagram':
        // Instagram doesn't have a direct share link API, we'll copy to clipboard instead
        navigator.clipboard.writeText(`${shareTitle}\n${shareDescription}\n${shareUrl}`)
        toast({
          title: "Instagram Sharing",
          description: "Link copied to clipboard. Open Instagram to share.",
        })
        return
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareDescription}\n${shareUrl}`)}`
        break
      case 'tiktok':
        // TikTok doesn't have a direct share API, copy to clipboard
        navigator.clipboard.writeText(`${shareTitle}\n${shareDescription}\n${shareUrl}`)
        toast({
          title: "TikTok Sharing",
          description: "Link copied to clipboard. Open TikTok to share.",
        })
        return
      default:
        // Generic share if available
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareDescription,
            url: shareUrl,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing:', error))
          return
        } else {
          navigator.clipboard.writeText(`${shareTitle}\n${shareDescription}\n${shareUrl}`)
          toast({
            title: "Sharing",
            description: "Link copied to clipboard.",
          })
          return
        }
    }

    // Open the share link in a new window
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-white/60">Share: </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="bg-[#1877F2] hover:bg-[#1877F2]/90 border-none w-8 h-8"
      >
        <Facebook className="h-4 w-4 text-white" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('instagram')}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none w-8 h-8"
      >
        <Instagram className="h-4 w-4 text-white" />
        <span className="sr-only">Share on Instagram</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('whatsapp')}
        className="bg-[#25D366] hover:bg-[#25D366]/90 border-none w-8 h-8"
      >
        <MessageCircle className="h-4 w-4 text-white" />
        <span className="sr-only">Share on WhatsApp</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('tiktok')}
        className="bg-black hover:bg-gray-900 border-none w-8 h-8"
      >
        <Share2 className="h-4 w-4 text-white" />
        <span className="sr-only">Share on TikTok</span>
      </Button>
    </div>
  )
}
