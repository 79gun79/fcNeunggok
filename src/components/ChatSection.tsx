import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, User } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { sendChatMessage } from '@/api/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: '안녕하세요! 저는 흥미니입니다. 무엇을 도와드릴까요?',
};

let messageIdCounter = 0;
const createMessageId = () => `msg-${(messageIdCounter += 1)}`;

const ChatSection = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialMessage = useRef(false);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending || !user) return;

    const history = [
      ...messages,
      { id: createMessageId(), role: 'user' as const, content: trimmed },
    ];
    setMessages(history);
    setDraft('');
    setIsSending(true);

    const { reply, error } = await sendChatMessage(
      history.map(({ role, content }) => ({ role, content })),
    );
    setIsSending(false);

    if (error || !reply) {
      sonnerToast.error(error ?? '챗봇 응답을 가져오지 못했습니다.');
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), role: 'assistant', content: reply },
    ]);
  };

  useEffect(() => {
    if (hasSentInitialMessage.current || authLoading || !user) return;
    hasSentInitialMessage.current = true;

    const initialMessage = (
      location.state as { initialMessage?: string } | null
    )?.initialMessage;
    if (initialMessage) sendMessage(initialMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(draft);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-2xl flex-col px-3 sm:h-[calc(100vh-4rem)] sm:px-6">
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="flex flex-col gap-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.role === 'user' && 'flex-row-reverse',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <img
                    src="/profile/chatBot.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
              <p
                className={cn(
                  'max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {message.content}
              </p>
            </li>
          ))}
          {isSending && (
            <li className="flex items-end gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
                <img
                  src="/profile/chatBot.png"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <p className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                입력 중...
              </p>
            </li>
          )}
        </ul>
        <div ref={scrollEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-border py-4"
      >
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={user ? '메시지를 입력하세요' : '로그인 후 이용해주세요'}
          className="min-h-[44px] flex-1 resize-none"
          maxLength={1000}
          disabled={!user}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || !draft.trim() || !user}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatSection;
