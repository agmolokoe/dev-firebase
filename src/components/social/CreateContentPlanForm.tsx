
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { ContentPlanFormData } from "@/types/content"
import { UseMutationResult } from "@tanstack/react-query"
import { addDays, startOfToday } from "date-fns"

interface CreateContentPlanFormProps {
  form: UseFormReturn<ContentPlanFormData>
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  createContentPlan: UseMutationResult<void, Error, ContentPlanFormData>
  onSubmit: (data: ContentPlanFormData) => void
}

const contentSuggestions = {
  instagram: {
    post: [
      "Share a behind-the-scenes look at your business",
      "Customer success story or testimonial",
      "Product feature highlight",
      "Industry tips and tricks",
      "Team spotlight"
    ],
    story: [
      "Quick product demo",
      "Poll your audience",
      "Share daily updates",
      "Quick tips",
      "Q&A session"
    ],
    reel: [
      "Tutorial or how-to video",
      "Product showcase",
      "Day in the life",
      "Before and after transformation",
      "Trending audio/challenge participation"
    ]
  },
  tiktok: {
    post: [
      "Trending challenge participation",
      "Quick tutorial",
      "Behind the scenes",
      "Product demonstration",
      "Day in the life content"
    ]
  }
}

export function CreateContentPlanForm({
  form,
  isOpen,
  setIsOpen,
  createContentPlan,
  onSubmit
}: CreateContentPlanFormProps) {
  const generateSuggestion = () => {
    const platform = form.getValues("platform")
    const contentType = form.getValues("content_type")
    
    const suggestions = contentSuggestions[platform as keyof typeof contentSuggestions]?.[contentType as keyof (typeof contentSuggestions)['instagram' | 'tiktok']] || []
    
    if (suggestions.length > 0) {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      form.setValue("title", randomSuggestion)
      form.setValue("description", `Content plan for: ${randomSuggestion}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
          <Plus className="mr-2 h-4 w-4" />
          Create Content Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Create Content Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="flex-1 mr-2">
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="reel">Reel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        {...field}
                        className="bg-white/5 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateSuggestion}
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Suggest
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      className="bg-white/5 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduled_for"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Schedule For</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal bg-white/5 border-white/10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) =>
                          date < startOfToday() || date > addDays(new Date(), 90)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hashtags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hashtags (comma-separated)"
                      {...field}
                      className="bg-white/5 border-white/10"
                      onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              disabled={createContentPlan.isPending}
            >
              {createContentPlan.isPending ? "Creating..." : "Create Plan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

