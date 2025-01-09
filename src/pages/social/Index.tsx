import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { WhatsAppForm } from "@/components/social/WhatsAppForm"
import { InstagramForm } from "@/components/social/InstagramForm"
import { SocialConnection } from "@/types/social"

export default function SocialPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
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
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF]">Social Media Integration</h1>
        <p className="text-[#FFFFFF]/60 mt-2">
          Connect your social media accounts to enhance your shop's reach
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WhatsAppForm connections={connections} onConnect={fetchConnections} />
        <InstagramForm connections={connections} onConnect={fetchConnections} />
      </div>
    </div>
  )
}