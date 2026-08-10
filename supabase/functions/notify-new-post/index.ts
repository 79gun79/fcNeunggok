import { createClient } from 'npm:@supabase/supabase-js@2';
import admin from 'npm:firebase-admin@12';
import { cleanupInvalidFcmTokens } from '../_shared/cleanupFcmTokens.ts';

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
    const authorId = decodeUserIdFromJwt(req.headers.get('Authorization'));
    if (!authorId) {
      return new Response(JSON.stringify({ error: '인증이 필요합니다.' }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    const { postId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('title, author, user_id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: '게시글을 찾을 수 없습니다.' }),
        { status: 404, headers: jsonHeaders },
      );
    }

    // 요청자가 실제 작성자인지 확인 (임의의 postId로 스푸핑 방지)
    if (post.user_id !== authorId) {
      return new Response(JSON.stringify({ error: '권한이 없습니다.' }), {
        status: 403,
        headers: jsonHeaders,
      });
    }

    const { data: tokenRows, error: tokenError } = await supabase
      .from('fcm_tokens')
      .select('token')
      .neq('user_id', authorId);

    if (tokenError) throw tokenError;

    const tokens = (tokenRows ?? []).map((row) => row.token);
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    // notification 필드를 쓰면 브라우저가 자동으로 한 번 띄우고, 서비스 워커의
    // onBackgroundMessage가 또 띄워서 알림이 중복 발송된다. data만 보내고
    // 표시는 서비스 워커 쪽에서만 하도록 한다.
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: {
        title: 'FC 능곡 커뮤니티',
        body: `${post.author}님이 새 글을 남겼어요: ${post.title}`,
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
