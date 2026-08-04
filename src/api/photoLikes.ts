import { supabase } from '@/lib/supabase';

export interface PhotoLike {
  photo_id: number;
  user_id: string;
}

export const fetchPhotoLikes = async (): Promise<PhotoLike[]> => {
  const { data, error } = await supabase
    .from('photo_likes')
    .select('photo_id, user_id');

  if (error) {
    console.error('좋아요 목록 조회 오류:', error);
    return [];
  }

  return data || [];
};

export const likePhoto = async (
  photoId: number,
  userId: string,
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('photo_likes')
    .insert([{ photo_id: photoId, user_id: userId }]);

  if (error) {
    console.error('좋아요 추가 오류:', error);
    return { success: false, error: '좋아요 처리에 실패했습니다.' };
  }

  notifyPhotoLike(photoId);

  return { success: true };
};

const notifyPhotoLike = async (photoId: number) => {
  try {
    const { error } = await supabase.functions.invoke('notify-photo-like', {
      body: { photoId },
    });

    if (error) {
      console.error('좋아요 알림 발송 오류:', error);
    }
  } catch (error) {
    console.error('좋아요 알림 발송 실패:', error);
  }
};

export const unlikePhoto = async (
  photoId: number,
  userId: string,
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('photo_likes')
    .delete()
    .eq('photo_id', photoId)
    .eq('user_id', userId);

  if (error) {
    console.error('좋아요 취소 오류:', error);
    return { success: false, error: '좋아요 취소에 실패했습니다.' };
  }

  return { success: true };
};
