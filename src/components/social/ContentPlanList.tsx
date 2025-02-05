
import { ContentPlan } from "@/types/content"
import { ContentPlanCard } from "./ContentPlanCard"
import { UseMutationResult } from "@tanstack/react-query"

interface ContentPlanListProps {
  contentPlans: ContentPlan[]
  isLoading: boolean
  deleteContentPlan: UseMutationResult<void, Error, string>
}

export function ContentPlanList({ contentPlans, isLoading, deleteContentPlan }: ContentPlanListProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading content plans...</div>
  }

  if (contentPlans.length === 0) {
    return (
      <div className="text-center py-4 text-white/60">
        No content plans yet. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {contentPlans.map((plan) => (
        <ContentPlanCard
          key={plan.id}
          plan={plan}
          deleteContentPlan={deleteContentPlan}
        />
      ))}
    </div>
  )
}
