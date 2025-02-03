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
      // This would typically call your AI service
      // For now, generating mock ideas
      const mockIdeas = [
        `How to optimize your ${topic} strategy for better results`,
        `5 innovative ways to leverage ${topic} in your business`,
        `The future of ${topic}: Trends and predictions`,
        `Case study: Successful ${topic} implementation`,
        `${topic} tips and tricks for beginners`
      ]
      
      setIdeas(mockIdeas)
    } catch (error) {
      console.error('Error generating ideas:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate content ideas. Please try again.",
        variant: "destructive",
      })
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