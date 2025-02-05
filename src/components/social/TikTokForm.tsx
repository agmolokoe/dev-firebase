
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { BrandTiktok } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { SocialConnection } from "@/types/social"

interface TikTokFormProps {
  connections: SocialConnection[]
  onConnect: () => void
}

export function TikTokForm({ connections, onConnect }: TikTokFormProps) {
  const [tiktokHandle, setTiktokHandle] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const validateTikTokHandle = (handle: string) => {
    const handleRegex = /^[a-zA-Z0-9._]{2,24}$/
    return handleRegex.test(handle)
  }

  const handleTikTokConnect = async () => {
    if (!tiktokHandle) {
      toast({
        title: "Error",
        description: "Please enter your TikTok handle",
        variant: "destructive",
      })
      return
    }

    if (!validateTikTokHandle(tiktokHandle)) {
      toast({
        title: "Invalid Handle",
        description: "Please enter a valid TikTok handle (2-24 characters, letters, numbers, dots, and underscores only)",
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
          platform: 'tiktok',
          handle: tiktokHandle,
          user_id: user.id
        })

      if (error) throw error
      
      toast({
        title: "TikTok Connected",
        description: "Your TikTok account has been connected successfully.",
      })
      
      setTiktokHandle("")
      onConnect()
    } catch (error) {
      console.error('Error connecting TikTok:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect TikTok. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const isConnected = connections.some(c => c.platform === 'tiktok')

  return (
    <Card className="bg-black text-white border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrandTiktok className="h-5 w-5" />
          TikTok
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect your TikTok account to share content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter TikTok handle"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
              disabled={isConnecting || isConnected}
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-sm text-white/60">
              Enter your TikTok handle without @ symbol
            </p>
          </div>
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-500">
              <span className="text-sm">✓ Connected</span>
            </div>
          ) : (
            <Button
              className="w-full bg-[#00f2ea] text-black hover:bg-[#00d9d2]"
              onClick={handleTikTokConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect TikTok"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
