import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';

const ChatFab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  if (location.pathname === '/chat') return null;

  return (
    <div
      className="fixed bottom-16 right-8 z-40 sm:bottom-6 sm:right-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow-lg"
          >
            안녕하세요! 저는 흥미니에요!
            <div className="absolute right-5 top-full h-2 w-2 -translate-y-1 rotate-45 bg-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="흥미니 챗봇 열기"
        onClick={() => navigate('/chat')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:h-16 sm:w-16"
      >
        <img
          src="/profile/chatBot.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.button>
    </div>
  );
};

export default ChatFab;
