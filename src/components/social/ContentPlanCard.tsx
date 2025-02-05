
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentPlan } from "@/types/content"
import { UseMutationResult } from "@tanstack/react-query"

interface ContentPlanCardProps {
  plan: ContentPlan
  deleteContentPlan: UseMutationResult<void, Error, string>
}

export function ContentPlanCard({ plan, deleteContentPlan }: ContentPlanCardProps) {
  return (
    <div
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
  )
}
