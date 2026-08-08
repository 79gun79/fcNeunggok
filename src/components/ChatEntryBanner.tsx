import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatEntryBanner = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const enterChat = () => {
    const initialMessage = value.trim();
    navigate(
      '/chat',
      initialMessage ? { state: { initialMessage } } : undefined,
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    enterChat();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.24 }}
      className="pointer-events-auto mt-10 w-full max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors focus-within:border-white/30 focus-within:bg-white/15 sm:px-5 sm:py-4"
      >
        <img
          src="/profile/chatBot.png"
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="안녕하세요! 흥미니에요!"
          aria-label="흥미니 챗봇에게 질문하기"
          className="min-w-0 flex-1 bg-transparent !text-sm !text-white placeholder:!text-white/50 focus:outline-none sm:!text-base"
        />
        <button
          type="submit"
          aria-label="챗봇으로 이동"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-md shadow-black/20 transition-colors hover:bg-white/30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-4 text-xs text-white/60 sm:text-sm">
        FC 능곡 AI 챗봇 · Heungmini
      </p>
    </motion.div>
  );
};

export default ChatEntryBanner;
