import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getAvatarUrl, getBestDisplayName } from '@/api/posts';
import { Comment } from '@/types/comment';

export const commentDraftSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, '댓글 내용을 입력해 주세요.')
    .max(1000, '댓글은 1000자 이하로 작성해 주세요.'),
});

export type CommentDraft = z.infer<typeof commentDraftSchema>;

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        'id, post_id, content, author, avatar_url, user_id, created_at, updated_at',
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('댓글 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    return [];
  }
};

const notifyNewComment = async (commentId: number) => {
  try {
    const { error } = await supabase.functions.invoke('notify-new-comment', {
      body: { commentId },
    });

    if (error) {
      console.error('댓글 알림 발송 오류:', error);
    }
  } catch (error) {
    console.error('댓글 알림 발송 실패:', error);
  }
};

export const createComment = async (
  postId: number,
  draft: CommentDraft,
): Promise<{ success: boolean; error?: string; comment?: Comment }> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '인증이 필요합니다. 로그인을 해주세요.' };
    }

    const { content } = commentDraftSchema.parse(draft);

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          content,
          author: getBestDisplayName(user),
          avatar_url: getAvatarUrl(user),
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('댓글 작성 오류:', error);
      return { success: false, error: '댓글 작성에 실패했습니다.' };
    }

    notifyNewComment(data.id);

    return { success: true, comment: data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    console.error('댓글 작성 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

export const deleteComment = async (
  commentId: number,
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
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) {
      console.error('댓글 삭제 오류:', error);
      return { success: false, error: '댓글 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};
