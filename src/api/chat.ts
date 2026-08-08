import { supabase } from '@/lib/supabase';

export type ChatApiMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const sendChatMessage = async (
  messages: ChatApiMessage[],
): Promise<{ reply?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-completion', {
      body: { messages },
    });

    if (error) {
      console.error('챗봇 응답 오류:', error);
      return { error: '챗봇 응답을 가져오지 못했습니다.' };
    }

    if (!data?.reply) {
      return { error: data?.error ?? '챗봇 응답을 가져오지 못했습니다.' };
    }

    return { reply: data.reply };
  } catch (error) {
    console.error('챗봇 요청 실패:', error);
    return { error: '챗봇 요청에 실패했습니다.' };
  }
};
