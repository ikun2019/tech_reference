export const runtime = "nodejs";
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import axiosClient from '@/utils/axiosClient';

export async function POST(req) {
  try {
    const { coupon_id } = await req.json();
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const gatewayResponse = await axiosClient.post('/api/coupon',
      { coupon_id: coupon_id },
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    );

    return new Response(JSON.stringify(gatewayResponse.data), {
      status: gatewayResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    const status = error?.response?.status ?? 500;
    const payload = error?.response?.data ?? { error: 'Failed to call gateway' };
    return new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
