
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ContentPlan, ContentPlanFormData } from "@/types/content"
import { useForm } from "react-hook-form"
import { CreateContentPlanForm } from "./CreateContentPlanForm"
import { ContentPlanList } from "./ContentPlanList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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
      scheduled_for: new Date().toISOString(),
    },
  })

  const { data: contentPlans, isLoading } = useQuery({
    queryKey: ['content-plans'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('content_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      return data as ContentPlan[]
    },
  })

  const createContentPlan = useMutation({
    mutationFn: async (data: ContentPlanFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('content_plans')
        .insert([{
          ...data,
          user_id: user.id,
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
        <div>
          <h2 className="text-lg font-semibold">Content Planner</h2>
          <p className="text-sm text-white/60">Plan and schedule your social media content</p>
        </div>
        <CreateContentPlanForm
          form={form}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          createContentPlan={createContentPlan}
          onSubmit={onSubmit}
        />
      </div>

      <ContentPlanList
        contentPlans={contentPlans || []}
        isLoading={isLoading}
        deleteContentPlan={deleteContentPlan}
      />
    </div>
  )
}
