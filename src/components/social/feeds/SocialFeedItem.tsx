
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface SocialFeedItemProps {
  feed: {
    id: string
    platform: string
    content: string
    media_urls: string[]
    engagement_stats: {
      likes?: number
      comments?: number
      shares?: number
    }
    posted_at: string
  }
}

export function SocialFeedItem({ feed }: SocialFeedItemProps) {
  return (
    <Card className="bg-black border-white/10">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <div className="flex-1">
          <p className="text-sm text-white/60">
            Posted on {feed.platform} • {formatDistanceToNow(new Date(feed.posted_at))} ago
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <p className="text-white/90">{feed.content}</p>
        {feed.media_urls?.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {feed.media_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Media ${index + 1}`}
                className="rounded-lg object-cover w-full aspect-square"
              />
            ))}
          </div>
        )}
        <div className="flex items-center space-x-6 text-sm text-white/60">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>{feed.engagement_stats.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{feed.engagement_stats.comments || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>{feed.engagement_stats.shares || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
