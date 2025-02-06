
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ContentAnalyzer } from "@/components/social/ContentAnalyzer"
import { ContentGenerator } from "@/components/social/ContentGenerator"
import { ContentPlanner } from "@/components/social/ContentPlanner"
import { SocialConnectionsSection } from "@/components/social/connections/SocialConnectionsSection"
import { SocialFeedList } from "@/components/social/feeds/SocialFeedList"
import { SocialConnection } from "@/types/social"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2 } from "lucide-react"

export default function SocialPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setConnections(data || [])
    } catch (error) {
      console.error('Error fetching connections:', error)
      toast({
        title: "Error",
        description: "Failed to load social connections",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_connections')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Social connection removed successfully",
      })
      
      fetchConnections()
    } catch (error) {
      console.error('Error deleting connection:', error)
      toast({
        title: "Error",
        description: "Failed to remove social connection",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Social Media Integration</h1>
              <p className="text-white/60 mt-2">
                Connect and manage your social media accounts
              </p>
            </div>
            <Share2 className="h-8 w-8 text-white/60" />
          </div>
        </div>

        {/* Social Media Feed */}
        <Card className="bg-black text-white border-white/10">
          <CardHeader>
            <CardTitle>Social Media Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialFeedList />
          </CardContent>
        </Card>

        {/* Content Analysis & Generation */}
        <div className="space-y-8">
          <ContentAnalyzer />
          <ContentGenerator />
        </div>

        {/* Content Planner */}
        <Card className="bg-black text-white border-white/10">
          <CardHeader>
            <CardTitle>Content Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentPlanner />
          </CardContent>
        </Card>

        {/* Social Connections */}
        <SocialConnectionsSection 
          connections={connections}
          onConnect={fetchConnections}
          onDeleteConnection={handleDeleteConnection}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  )
}
