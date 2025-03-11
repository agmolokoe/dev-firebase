
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const [open, setOpen] = useState(false);
  
  if (totalItems === 0) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <CartIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              Your cart is empty. Start shopping!
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <CartIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button className="mt-4" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-2 py-1 min-w-[20px] min-h-[20px] flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div className="flex flex-col h-full">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle>Your Cart</SheetTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            <SheetDescription>
              You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      {formatCurrency(item.price)} each
                    </p>
                    
                    <div className="flex items-center">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="ml-auto font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <Button className="w-full mt-4">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
