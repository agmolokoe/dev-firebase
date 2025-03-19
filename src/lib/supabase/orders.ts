
import { supabase } from './client'
import { Order } from './types'

export const orders = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

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
  create: async (order: Omit<Order, 'id' | 'created_at' | 'business_id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order, business_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  update: async (id: string, order: Partial<Order>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .eq('business_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('business_id', user.id)
    
    if (error) throw error
  }
}
