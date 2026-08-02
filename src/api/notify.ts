import { supabase } from '@/lib/supabase';

export const notifyScoreChange = async (name: string, score: number) => {
  try {
    const { error } = await supabase.functions.invoke('notify-score-change', {
      body: { name, score },
    });

    if (error) {
      console.error('알림 발송 오류:', error);
    }
  } catch (error) {
    console.error('알림 발송 실패:', error);
  }
};
