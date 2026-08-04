import { createClient } from 'npm:@supabase/supabase-js@2';
import admin from 'npm:firebase-admin@12';

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

const decodeUserIdFromJwt = (authHeader: string | null): string | null => {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    );
    return decoded.sub ?? null;
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
    const likerId = decodeUserIdFromJwt(req.headers.get('Authorization'));
    if (!likerId) {
      return new Response(JSON.stringify({ error: '인증이 필요합니다.' }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    const { photoId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('user_id')
      .eq('id', photoId)
      .single();

    if (photoError || !photo) {
      return new Response(
        JSON.stringify({ error: '사진을 찾을 수 없습니다.' }),
        { status: 404, headers: jsonHeaders },
      );
    }

    // 본인 사진에 본인이 좋아요를 누른 경우는 알림을 보내지 않음
    if (photo.user_id === likerId) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const { data: tokenRows, error: tokenError } = await supabase
      .from('fcm_tokens')
      .select('token')
      .eq('user_id', photo.user_id);

    if (tokenError) throw tokenError;

    const tokens = (tokenRows ?? []).map((row) => row.token);
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const {
      data: { user: liker },
    } = await supabase.auth.admin.getUserById(likerId);
    const likerName =
      liker?.user_metadata?.full_name ||
      liker?.email?.split('@')[0] ||
      '누군가';

    // notification 필드를 쓰면 브라우저가 자동으로 한 번 띄우고, 서비스 워커의
    // onBackgroundMessage가 또 띄워서 알림이 중복 발송된다. data만 보내고
    // 표시는 서비스 워커 쪽에서만 하도록 한다.
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: {
        title: 'FC 능곡 갤러리',
        body: `${likerName}님이 회원님의 사진을 흥모띠! 🙄`,
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
