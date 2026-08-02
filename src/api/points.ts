import { supabase } from '@/lib/supabase';
import { Point } from '@/types/point';

export const fetchPoints = async (): Promise<Point[]> => {
  try {
    const { data, error } = await supabase
      .from('points')
      .select('id, name, color, image, score')
      .order('score', { ascending: false });

    if (error) {
      console.error('포인트 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('포인트 조회 실패:', error);
    return [];
  }
};

export const updatePointScore = async (
  id: string,
  score: number,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('points')
      .update({ score, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('점수 수정 오류:', error);
      return { success: false, error: '점수 수정에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('점수 수정 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};
