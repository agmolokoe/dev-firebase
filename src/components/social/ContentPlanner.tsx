
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ContentPlan, ContentPlanFormData } from "@/types/content"
import { useForm } from "react-hook-form"

export function ContentPlanner() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ContentPlanFormData>({
    defaultValues: {
      platform: "instagram",
      content_type: "post",
      title: "",
      description: "",
      hashtags: [],
    },
  })

  const { data: contentPlans, isLoading } = useQuery({
    queryKey: ['content-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_plans')
        .select('*')
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      return data as ContentPlan[]
    },
  })

  const createContentPlan = useMutation({
    mutationFn: async (data: ContentPlanFormData) => {
      const { error } = await supabase
        .from('content_plans')
        .insert([{
          ...data,
          status: 'draft',
          hashtags: data.hashtags?.join(',').split(',').map(tag => tag.trim()) || [],
        }])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-plans'] })
      toast({
        title: "Success",
        description: "Content plan created successfully",
      })
      setIsOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content plan",
        variant: "destructive",
      })
    },
  })

  const deleteContentPlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_plans')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-plans'] })
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content plan",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: ContentPlanFormData) => {
    createContentPlan.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Content Planner</h2>
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
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
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
                              date < new Date(new Date().setHours(0, 0, 0, 0))
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
                          onChange={(e) => field.onChange(e.target.value.split(','))}
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
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading content plans...</div>
      ) : contentPlans?.length === 0 ? (
        <div className="text-center py-4 text-white/60">
          No content plans yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {contentPlans?.map((plan) => (
            <div
              key={plan.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="capitalize font-medium">{plan.platform}</span>
                  <span className="mx-2 text-white/40">•</span>
                  <span className="text-white/60">{plan.content_type}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteContentPlan.mutate(plan.id)}
                  disabled={deleteContentPlan.isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <h3 className="font-medium">{plan.title}</h3>
              {plan.description && (
                <p className="text-sm text-white/60">{plan.description}</p>
              )}
              {plan.scheduled_for && (
                <p className="text-sm text-white/60">
                  Scheduled for: {format(new Date(plan.scheduled_for), "PPP")}
                </p>
              )}
              {plan.hashtags && plan.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {plan.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
