import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://plquxmkydifejukpoocr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscXV4bWt5ZGlmZWp1a3Bvb2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNzMzNDIsImV4cCI6MjA1MTc0OTM0Mn0.YY8UopCyclJdq1q2vuj233FQHwsENaoL5LOdOntVY8E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database tables
export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  lastPurchase: string
  totalOrders: number
  created_at?: string
}

export type Product = {
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: string
  created_at?: string
}

export type Order = {
  id: string
  customer_id: string
  date: string
  status: string
  total: number
  items: number
  created_at?: string
}

// Database queries
export const db = {
  customers: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    create: async (customer: Omit<Customer, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    update: async (id: string, customer: Partial<Customer>) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },
  products: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    create: async (product: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    update: async (id: string, product: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },
  orders: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    create: async (order: Omit<Order, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    update: async (id: string, order: Partial<Order>) => {
      const { data, error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  }
}