import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'blugia-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: async (_name, _acquireTimeout, fn) => await fn(),
  },
})
