import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import { CustomerDialog } from "@/components/customers/CustomerDialog"
import { CustomerDetails } from "@/components/customers/CustomerDetails"

// Temporary type definition until we integrate with backend
type Customer = {
  id: string
  name: string
  email: string
  phone: string
  lastPurchase: string
  totalOrders: number
}

export default function CustomersPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  // Temporary data - will be replaced with API calls
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      lastPurchase: "2024-02-20",
      totalOrders: 5
    },
    // Add more sample customers as needed
  ])

  const handleDelete = (customerId: string) => {
    // Will be replaced with API call
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully deleted."
    })
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Last Purchase</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.lastPurchase}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(customer)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(customer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
      />
      
      <CustomerDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        customer={selectedCustomer}
      />
    </div>
  )
}