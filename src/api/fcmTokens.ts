import { supabase } from '@/lib/supabase';

export const saveFcmToken = async (
  token: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '인증이 필요합니다. 로그인을 해주세요.' };
    }

    const { error } = await supabase.from('fcm_tokens').upsert(
      {
        user_id: user.id,
        token,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'token' },
    );

    if (error) {
      console.error('FCM 토큰 저장 오류:', error);
      return { success: false, error: 'FCM 토큰 저장에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('FCM 토큰 저장 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};
