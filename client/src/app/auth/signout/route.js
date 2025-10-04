export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';

export async function POST(req) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}