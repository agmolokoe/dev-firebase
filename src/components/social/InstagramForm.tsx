import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Instagram } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { SocialConnection } from "@/types/social"

interface InstagramFormProps {
  connections: SocialConnection[]
  onConnect: () => void
}

export function InstagramForm({ connections, onConnect }: InstagramFormProps) {
  const [instagramHandle, setInstagramHandle] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const validateInstagramHandle = (handle: string) => {
    const handleRegex = /^[a-zA-Z0-9._]{1,30}$/
    return handleRegex.test(handle)
  }

  const handleInstagramConnect = async () => {
    if (!instagramHandle) {
      toast({
        title: "Error",
        description: "Please enter your Instagram handle",
        variant: "destructive",
      })
      return
    }

    if (!validateInstagramHandle(instagramHandle)) {
      toast({
        title: "Invalid Handle",
        description: "Please enter a valid Instagram handle (letters, numbers, dots, and underscores only)",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('social_connections')
        .upsert({
          platform: 'instagram',
          handle: instagramHandle,
          user_id: user.id
        })

      if (error) throw error
      
      toast({
        title: "Instagram Connected",
        description: "Your Instagram account has been connected successfully.",
      })
      
      setInstagramHandle("")
      onConnect()
    } catch (error) {
      console.error('Error connecting Instagram:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect Instagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Card className="bg-black text-white border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Instagram Shop
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect your Instagram account to showcase products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter Instagram handle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              disabled={isConnecting}
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-sm text-white/60">
              Enter your Instagram handle without @ symbol
            </p>
          </div>
          <Button
            className="w-full bg-white text-black hover:bg-white/90"
            onClick={handleInstagramConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Instagram"}
          </Button>
          {connections.find(c => c.platform === 'instagram') && (
            <p className="text-sm text-white">✓ Connected</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}