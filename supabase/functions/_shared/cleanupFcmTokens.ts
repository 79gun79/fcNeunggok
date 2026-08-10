import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

const INVALID_TOKEN_ERROR_CODES = [
  'messaging/registration-token-not-registered',
  'messaging/invalid-argument',
];

interface MulticastLikeResponse {
  responses: Array<{ success: boolean; error?: { code: string } }>;
}

// FCM 응답에서 만료/무효로 판정된 토큰만 걸러 fcm_tokens 테이블에서 삭제한다.
// 이 정리를 하지 않으면 재설치/로그아웃 등으로 죽은 토큰이 계속 쌓여
// 발송 실패가 누적되고 원인 추적도 어려워진다.
export const cleanupInvalidFcmTokens = async (
  supabase: SupabaseClient,
  tokens: string[],
  response: MulticastLikeResponse,
) => {
  const invalidTokens = response.responses
    .map((result, index) =>
      !result.success &&
      result.error &&
      INVALID_TOKEN_ERROR_CODES.includes(result.error.code)
        ? tokens[index]
        : null,
    )
    .filter((token): token is string => token !== null);

  if (invalidTokens.length === 0) return;

  const { error } = await supabase
    .from('fcm_tokens')
    .delete()
    .in('token', invalidTokens);

  if (error) {
    console.error('무효 FCM 토큰 삭제 실패:', error);
  }
};
