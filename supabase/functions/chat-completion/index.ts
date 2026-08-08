const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const OPENAI_MODEL = 'gpt-4o-mini';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT =
  '당신은 FC 능곡 축구 동호회의 커뮤니티 챗봇 "흥미니"입니다. ' +
  '친근하고 간결한 반말 섞인 존댓말로 답하고, 모르는 사실(멤버 개인정보, 실시간 일정 등)은 ' +
  '지어내지 말고 모른다고 솔직히 답하세요.';

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

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

const isValidMessage = (value: unknown): value is IncomingMessage =>
  !!value &&
  typeof value === 'object' &&
  ((value as IncomingMessage).role === 'user' ||
    (value as IncomingMessage).role === 'assistant') &&
  typeof (value as IncomingMessage).content === 'string' &&
  (value as IncomingMessage).content.length > 0 &&
  (value as IncomingMessage).content.length <= MAX_MESSAGE_LENGTH;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    const userId = decodeUserIdFromJwt(req.headers.get('Authorization'));
    if (!userId) {
      return new Response(JSON.stringify({ error: '인증이 필요합니다.' }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    const { messages } = await req.json();

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES ||
      !messages.every(isValidMessage)
    ) {
      return new Response(
        JSON.stringify({ error: '잘못된 메시지 형식입니다.' }),
        { status: 400, headers: jsonHeaders },
      );
    }

    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 500,
          temperature: 0.7,
        }),
      },
    );

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      console.error('OpenAI API 오류:', openaiResponse.status, errorBody);
      return new Response(
        JSON.stringify({ error: '챗봇 응답을 가져오지 못했습니다.' }),
        { status: 502, headers: jsonHeaders },
      );
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return new Response(
        JSON.stringify({ error: '챗봇 응답을 가져오지 못했습니다.' }),
        { status: 502, headers: jsonHeaders },
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: '챗봇 요청 처리 중 오류가 발생했습니다.' }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
