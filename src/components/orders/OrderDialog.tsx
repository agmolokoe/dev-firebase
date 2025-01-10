import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

interface OrderFormData {
  customer_id: number;
  total_amount: number;
}

interface OrderDialogProps {
  mode: "create" | "edit";
  order?: {
    id: number;
    customer_id: number;
    total_amount: number;
  };
}

export function OrderDialog({ mode, order }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OrderFormData>({
    defaultValues: {
      customer_id: order?.customer_id || 0,
      total_amount: order?.total_amount || 0,
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    try {
      if (mode === "create") {
        const { error } = await supabase.from("orders").insert([data]);
        if (error) throw error;
        toast({
          title: "Order created",
          description: "The order has been created successfully",
        });
      } else {
        const { error } = await supabase
          .from("orders")
          .update(data)
          .eq("id", order?.id);
        if (error) throw error;
        toast({
          title: "Order updated",
          description: "The order has been updated successfully",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error processing your request",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === "create" ? "default" : "ghost"}>
          {mode === "create" ? "Create Order" : "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Order" : "Edit Order"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}