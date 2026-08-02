import { createClient } from 'npm:@supabase/supabase-js@2';
import admin from 'npm:firebase-admin@12';

const ADMIN_EMAIL = '79gun79@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

if (admin.apps.length === 0) {
  const serviceAccount = JSON.parse(
    Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON') ?? '{}',
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const decodeEmailFromJwt = (authHeader: string | null): string | null => {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    );
    return decoded.email ?? null;
  } catch {
    return null;
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    const email = decodeEmailFromJwt(req.headers.get('Authorization'));
    if (email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: '권한이 없습니다.' }), {
        status: 403,
        headers: jsonHeaders,
      });
    }

    const { name, score } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: rows, error } = await supabase
      .from('fcm_tokens')
      .select('token');

    if (error) throw error;

    const tokens = (rows ?? []).map((row) => row.token);
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: 'FC 능곡 포인트',
        body: `${name}님의 점수가 ${score}점으로 변경됐습니다.`,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      }),
      { status: 200, headers: jsonHeaders },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
