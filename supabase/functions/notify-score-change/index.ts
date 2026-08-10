import { createClient } from 'npm:@supabase/supabase-js@2';
import admin from 'npm:firebase-admin@12';
import { cleanupInvalidFcmTokens } from '../_shared/cleanupFcmTokens.ts';

const ADMIN_EMAILS = ['79gun79@gmail.com', 'neunggok123@gmail.com'];

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
    if (!email || !ADMIN_EMAILS.includes(email)) {
      return new Response(JSON.stringify({ error: '권한이 없습니다.' }), {
        status: 403,
        headers: jsonHeaders,
      });
    }

    const { name, oldScore, score, reason } = await req.json();

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

    const diff = score - oldScore;

    const baseBody =
      diff > 0
        ? `${name}아,  ${oldScore}점에서 점수 더 올랐어; 🤬`
        : diff < 0
          ? `${name}! 너, ${-diff}점 감면! 🎉`
          : `${name}! 너, ${score}점 그대로인데? 🙄`;

    const body = reason ? `${baseBody}\n사유: ${reason}` : baseBody;

    // notification 필드를 쓰면 브라우저가 자동으로 한 번 띄우고, 서비스 워커의
    // onBackgroundMessage가 또 띄워서 알림이 중복 발송된다. data만 보내고
    // 표시는 서비스 워커 쪽에서만 하도록 한다.
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: {
        title: 'FC 능곡 포인트',
        body,
      },
    });

    await cleanupInvalidFcmTokens(supabase, tokens, response);

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
