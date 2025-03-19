
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/DashboardLayout"

export function ProductsAuthError() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Authentication Required</h2>
          <p className="text-[#FFFFFF]/70 mb-6">
            You need to be logged in to view and manage products.
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
