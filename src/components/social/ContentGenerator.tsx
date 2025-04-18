import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Lightbulb, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function ContentGenerator() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [ideas, setIdeas] = useState<string[]>([])
  const { toast } = useToast()

  const generateIdeas = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate ideas",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          topic,
          type: 'ideas'
        }
      })

      if (error) throw error
      
      if (Array.isArray(data) && data.length > 0) {
        setIdeas(data)
        toast({
          title: "Ideas Generated",
          description: "Check out your new content ideas below!",
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      toast({
        title: "Generation Failed",
        description: "We're experiencing high traffic. Using alternative suggestions for now.",
        variant: "destructive",
      })
      // Set some default ideas as fallback
      setIdeas([
        "Share industry tips and best practices",
        "Create how-to guides for common problems",
        "Highlight customer success stories",
        "Share behind-the-scenes content",
        "Post industry news and updates"
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="bg-black text-white border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Content Idea Generator
        </CardTitle>
        <CardDescription className="text-white/60">
          Generate engaging content ideas for your social media
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a topic (e.g., Digital Marketing)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              disabled={isGenerating}
            />
            <Button
              onClick={generateIdeas}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Ideas"
              )}
            </Button>
          </div>

          {ideas.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Generated Ideas:</h3>
              <ul className="space-y-2">
                {ideas.map((idea, index) => (
                  <li
                    key={index}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}