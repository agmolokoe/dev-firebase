import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Loader2, TrendingUp, Hash, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function ContentAnalyzer() {
  const { data: trends, isLoading, error } = useQuery({
    queryKey: ['social-trends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          topic: 'business and marketing',
          type: 'trends'
        }
      })

      if (error) {
        console.error('Error fetching trends:', error)
        throw error
      }
      
      if (!data || !data.trending_topics || !data.trending_hashtags || !data.competitor_insights) {
        throw new Error('Invalid response format')
      }

      return data
    },
    retry: 1, // Only retry once to avoid excessive API calls
    retryDelay: 1000,
  })

  if (error) {
    return (
      <Card className="bg-black text-white border-white/10">
        <CardContent className="p-6">
          <div className="text-red-400">
            Temporarily using cached trends data. Please refresh in a few minutes.
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
          <CardDescription className="text-white/60">
            Current trends in your industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {trends?.trending_topics.map((topic: string) => (
              <li key={topic} className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Popular Hashtags
          </CardTitle>
          <CardDescription className="text-white/60">
            Trending hashtags to increase visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trends?.trending_hashtags.map((hashtag: string) => (
              <span
                key={hashtag}
                className="px-3 py-1 rounded-full bg-white/10 text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Competitor Analysis
          </CardTitle>
          <CardDescription className="text-white/60">
            Content performance in your industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends?.competitor_insights.map((insight: { topic: string, engagement: number }) => (
              <div key={insight.topic} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{insight.topic}</span>
                  <span className="text-green-500">{insight.engagement}% engagement</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${insight.engagement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}