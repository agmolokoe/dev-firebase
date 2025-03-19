
import { supabase } from './client'
import { Customer } from './types'

export const customers = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  create: async (customer: Omit<Customer, 'id' | 'created_at' | 'business_id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...customer, business_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  update: async (id: string, customer: Partial<Customer>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('customers')
      .update(customer)
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
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('business_id', user.id)
    
    if (error) throw error
  }
}
