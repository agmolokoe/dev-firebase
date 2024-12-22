import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CustomerDetailsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: {
    id: string
    name: string
    email: string
    phone: string
    lastPurchase: string
    totalOrders: number
  } | null
}

export function CustomerDetails({
  open,
  onOpenChange,
  customer,
}: CustomerDetailsProps) {
  // Temporary order history data - will be replaced with API calls
  const orderHistory = [
    {
      id: "1",
      date: "2024-02-20",
      amount: "$150.00",
      status: "Completed",
    },
    {
      id: "2",
      date: "2024-02-15",
      amount: "$75.50",
      status: "Completed",
    },
  ]

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <div className="mt-2 space-y-2">
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Statistics</h3>
              <div className="mt-2 space-y-2">
                <p>Total Orders: {customer.totalOrders}</p>
                <p>Last Purchase: {customer.lastPurchase}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Order History</h3>
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}