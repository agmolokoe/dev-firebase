import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { SocialConnection } from "@/types/social"

interface WhatsAppFormProps {
  connections: SocialConnection[]
  onConnect: () => void
}

export function WhatsAppForm({ connections, onConnect }: WhatsAppFormProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const validateWhatsAppNumber = (number: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(number)
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
      onConnect()
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

  return (
    <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          WhatsApp Business
        </CardTitle>
        <CardDescription className="text-[#FFFFFF]/60">
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
              className="bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
            />
            <p className="text-sm text-[#FFFFFF]/60">
              Enter your number with country code (e.g., +1234567890)
            </p>
          </div>
          <Button
            className="w-full bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
            onClick={handleWhatsAppConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect WhatsApp"}
          </Button>
          {connections.find(c => c.platform === 'whatsapp') && (
            <p className="text-sm text-[#00F076]">✓ Connected</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}