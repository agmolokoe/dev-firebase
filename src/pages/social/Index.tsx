
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { WhatsAppForm } from "@/components/social/WhatsAppForm"
import { InstagramForm } from "@/components/social/InstagramForm"
import { ContentAnalyzer } from "@/components/social/ContentAnalyzer"
import { ContentGenerator } from "@/components/social/ContentGenerator"
import { ContentPlanner } from "@/components/social/ContentPlanner"
import { SocialConnection } from "@/types/social"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

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

        {/* Current Connections */}
        <Card className="bg-black text-white border-white/10">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-white/60">Loading connections...</p>
            ) : connections.length > 0 ? (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                  >
                    <div>
                      <p className="font-medium capitalize">{connection.platform}</p>
                      <p className="text-sm text-white/60">{connection.handle}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black text-white border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Connection</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this {connection.platform} connection? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteConnection(connection.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No social media accounts connected yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Connection Forms */}
        <div className="grid gap-6 md:grid-cols-2">
          <WhatsAppForm connections={connections} onConnect={fetchConnections} />
          <InstagramForm connections={connections} onConnect={fetchConnections} />
        </div>
      </div>
    </DashboardLayout>
  )
}
