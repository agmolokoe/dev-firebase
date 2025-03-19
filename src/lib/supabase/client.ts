
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://plquxmkydifejukpoocr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscXV4bWt5ZGlmZWp1a3Bvb2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNzMzNDIsImV4cCI6MjA1MTc0OTM0Mn0.YY8UopCyclJdq1q2vuj233FQHwsENaoL5LOdOntVY8E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
