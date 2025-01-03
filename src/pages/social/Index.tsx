import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { WhatsappIcon, Instagram, Share2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SocialPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const { toast } = useToast()

  const handleWhatsAppConnect = () => {
    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Please enter your WhatsApp business number",
        variant: "destructive",
      })
      return
    }
    
    // Here you would typically integrate with WhatsApp Business API
    toast({
      title: "WhatsApp Connected",
      description: "Your WhatsApp business account has been connected successfully.",
    })
  }

  const handleInstagramConnect = () => {
    if (!instagramHandle) {
      toast({
        title: "Error",
        description: "Please enter your Instagram handle",
        variant: "destructive",
      })
      return
    }

    // Here you would typically integrate with Instagram API
    toast({
      title: "Instagram Connected",
      description: "Your Instagram account has been connected successfully.",
    })
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
              <WhatsappIcon className="h-5 w-5 text-green-500" />
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
                />
                <p className="text-sm text-muted-foreground">
                  Enter your number with country code (e.g., +1234567890)
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleWhatsAppConnect}
              >
                Connect WhatsApp
              </Button>
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
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Instagram handle without @ symbol
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleInstagramConnect}
              >
                Connect Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}