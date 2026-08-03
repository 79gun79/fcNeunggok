import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

const ComingSoonBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.24 }}
      className="mt-10 w-full max-w-2xl"
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-5 sm:py-4">
        <span className="!text-sm !text-white/70 sm:!text-base">
          해당 기능은 준비 예정입니다.
        </span>
        <button
          type="button"
          aria-label="Show coming soon message"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-md shadow-black/20 transition-colors hover:bg-white/30"
          onClick={() => sonnerToast.info('해당 기능은 준비 예정입니다.')}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 text-xs text-white/60 sm:text-sm">
        To be continued...
      </p>
    </motion.div>
  );
};

export default ComingSoonBanner;
