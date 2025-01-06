import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Instagram, Share2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

interface SocialConnection {
  id: string
  platform: string
  handle: string
  user_id: string
  created_at: string
}

export default function SocialPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
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

  const validateWhatsAppNumber = (number: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(number)
  }

  const validateInstagramHandle = (handle: string) => {
    const handleRegex = /^[a-zA-Z0-9._]{1,30}$/
    return handleRegex.test(handle)
  }

  const handleWhatsAppConnect = async () => {
    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Please enter your WhatsApp business number",
        variant: "destructive",
      })
      return
    }

    if (!validateWhatsAppNumber(whatsappNumber)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid international phone number (e.g., +1234567890)",
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
          platform: 'whatsapp',
          handle: whatsappNumber,
          user_id: user.id
        })

      if (error) throw error
      
      toast({
        title: "WhatsApp Connected",
        description: "Your WhatsApp business account has been connected successfully.",
      })
      
      setWhatsappNumber("")
      fetchConnections()
    } catch (error) {
      console.error('Error connecting WhatsApp:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect WhatsApp. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
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
      fetchConnections()
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Integration</h1>
        <p className="text-muted-foreground mt-2">
          Connect your social media accounts to enhance your shop's reach
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              WhatsApp Business
            </CardTitle>
            <CardDescription>
              Connect your WhatsApp Business account to chat with customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter WhatsApp business number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  disabled={isConnecting}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your number with country code (e.g., +1234567890)
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleWhatsAppConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect WhatsApp"}
              </Button>
              {connections.find(c => c.platform === 'whatsapp') && (
                <p className="text-sm text-green-600">✓ Connected</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Instagram Shop
            </CardTitle>
            <CardDescription>
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
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Instagram handle without @ symbol
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleInstagramConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Instagram"}
              </Button>
              {connections.find(c => c.platform === 'instagram') && (
                <p className="text-sm text-green-600">✓ Connected</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}