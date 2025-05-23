import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_API_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export default supabase
