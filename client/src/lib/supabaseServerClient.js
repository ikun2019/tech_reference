import fs from 'fs';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = fs.existsSync(process.env.SUPABASE_URL_FILE) ? fs.readFileSync(process.env.SUPABASE_URL_FILE, 'utf-8').trim() : process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = fs.existsSync(process.env.SUPABASE_ANON_KEY_FILE) ? fs.readFileSync(process.env.SUPABASE_ANON_KEY_FILE, 'utf-8').trim() : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      }
    }
  )
};