import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined
let clientUrl: string | undefined
let clientKey: string | undefined

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseKey } = useRuntimeConfig().public
  return Boolean(supabaseUrl && supabaseKey)
}

export function useSupabaseClient(): SupabaseClient {
  const config = useRuntimeConfig().public
  const url = config.supabaseUrl
  const key = config.supabaseKey

  if (!url || !key) {
    throw new Error('Supabase is not configured. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_KEY.')
  }

  if (!client || url !== clientUrl || key !== clientKey) {
    client = createClient(url, key)
    clientUrl = url
    clientKey = key
  }

  return client
}
