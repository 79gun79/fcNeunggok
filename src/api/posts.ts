import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';

export const postDraftSchema = z.object({
  title: z.string().trim().min(2, '제목은 2글자 이상 입력해 주세요.').max(120, '제목은 120자 이하로 작성해 주세요.'),
  description: z.string().trim().min(2, '내용은 2글자 이상 입력해 주세요.').max(5000, '내용은 5000자 이하로 작성해 주세요.'),
});

export type PostDraft = z.infer<typeof postDraftSchema>;

export const getBestDisplayName = (user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}) => {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name);
  if (fromMeta) return fromMeta;
  const email = user.email ?? '';
  if (email.includes('@')) return email.split('@')[0];
  return '익명';
};

export const getAvatarUrl = (user: {
  user_metadata?: Record<string, unknown> | null;
}) => {
  const meta = user.user_metadata ?? {};
  return typeof meta.avatar_url === 'string' ? meta.avatar_url : null;
};

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, title, description, author, avatar_url, user_id, created_at, updated_at',
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('게시글 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return [];
  }
};

export const createPost = async (
  draft: PostDraft,
): Promise<{ success: boolean; error?: string; post?: Post }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '인증이 필요합니다. 로그인을 해주세요.' };
    }

    const { title, description } = postDraftSchema.parse(draft);

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          description,
          author: getBestDisplayName(user),
          avatar_url: getAvatarUrl(user),
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('게시글 작성 오류:', error);
      return { success: false, error: '게시글 작성에 실패했습니다.' };
    }

    return { success: true, post: data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    console.error('게시글 작성 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

export const updatePost = async (
  postId: number,
  draft: PostDraft,
): Promise<{ success: boolean; error?: string; post?: Post }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '인증이 필요합니다. 로그인을 해주세요.' };
    }

    const { title, description } = postDraftSchema.parse(draft);

    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('게시글 수정 오류:', error);
      return { success: false, error: '게시글 수정에 실패했습니다.' };
    }

    return { success: true, post: data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    console.error('게시글 수정 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

export const deletePost = async (
  postId: number,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '인증이 필요합니다. 로그인을 해주세요.' };
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) {
      console.error('게시글 삭제 오류:', error);
      return { success: false, error: '게시글 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};
