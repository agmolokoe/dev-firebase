import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppForm } from "../WhatsAppForm"
import { InstagramForm } from "../InstagramForm"
import { TikTokForm } from "../TikTokForm"
import { SocialConnection } from "@/types/social"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface SocialConnectionsSectionProps {
  connections: SocialConnection[]
  onConnect: () => void
  onDeleteConnection: (id: string) => Promise<void>
}

export function SocialConnectionsSection({
  connections,
  onConnect,
  onDeleteConnection,
}: SocialConnectionsSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-black text-white border-white/10">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length > 0 ? (
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
                          onClick={() => onDeleteConnection(connection.id)}
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

      <div className="grid gap-6 md:grid-cols-3">
        <WhatsAppForm connections={connections} onConnect={onConnect} />
        <InstagramForm connections={connections} onConnect={onConnect} />
        <TikTokForm connections={connections} onConnect={onConnect} />
      </div>
    </div>
  )
}
