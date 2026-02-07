import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

const supabase = createClient();

export function useSupabase() {
  return supabase;
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Insert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Update<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
