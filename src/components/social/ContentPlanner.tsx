
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ContentPlan, ContentPlanFormData } from "@/types/content"
import { useForm } from "react-hook-form"
import { CreateContentPlanForm } from "./CreateContentPlanForm"
import { ContentPlanList } from "./ContentPlanList"

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
