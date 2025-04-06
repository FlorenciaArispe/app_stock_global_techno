
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.VITE_API_SUPABASE_URL
// const supabaseKey = process.env.VITE_SUPABASE_API_KEY

const supabaseUrl = 'https://cuylrwevnvhervhflcxh.supabase.co'
const supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1eWxyd2V2bnZoZXJ2aGZsY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDAzNTUsImV4cCI6MjA1OTA3NjM1NX0.ih4UcFlfbG2f9N3z9XCS5fGDcpvczKROa09EB6gV1kQ'

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  

export default supabase;