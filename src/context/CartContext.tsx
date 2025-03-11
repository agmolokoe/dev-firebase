
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  business_id: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        toast({
          title: "Item quantity updated",
          description: `${newItem.name} quantity increased in your cart.`
        });
        return updatedItems;
      } else {
        // Add new item with quantity 1
        toast({
          title: "Item added to cart",
          description: `${newItem.name} has been added to your cart.`
        });
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };
  
  const removeItem = (itemId: number) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast({
          title: "Item removed from cart",
          description: `${itemToRemove.name} has been removed from your cart.`
        });
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };
  
  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart."
    });
  };
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
