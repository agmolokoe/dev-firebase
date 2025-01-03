import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data for orders
const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    date: "2024-02-20",
    status: "pending",
    total: 150.00,
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    date: "2024-02-19",
    status: "processing",
    total: 299.99,
  },
  {
    id: "ORD003",
    customer: "Bob Johnson",
    date: "2024-02-18",
    status: "completed",
    total: 75.50,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Orders Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "pending")}
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "processing")
                            }
                          >
                            Mark as Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "completed")
                            }
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}