
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialFeedItem } from "./SocialFeedItem"
import { Skeleton } from "@/components/ui/skeleton"

interface SocialFeed {
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

export function SocialFeedList() {
  const { data: feeds, isLoading } = useQuery({
    queryKey: ['social-feeds'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .eq('user_id', user.id)
        .order('posted_at', { ascending: false })
      
      if (error) throw error
      return data as SocialFeed[]
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-black border-white/10">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4 bg-white/5" />
                <Skeleton className="h-20 w-full bg-white/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!feeds?.length) {
    return (
      <Card className="bg-black border-white/10">
        <CardContent className="p-6">
          <p className="text-white/60">No social media posts found. Connect your accounts to see your feed here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <SocialFeedItem key={feed.id} feed={feed} />
      ))}
    </div>
  )
}
