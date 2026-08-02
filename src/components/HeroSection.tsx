import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, User2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';

const BANNER_IMAGES = [
  '/banner1.png',
  '/banner2.jpeg',
  '/banner3.jpeg',
  '/banner4.jpeg',
  '/banner5.jpeg',
];

const BANNER_INTERVAL_MS = 4500;

const HeroSection = () => {
  const [[bannerIndex, direction], setBannerState] = useState([0, 0]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBannerState(([current]) => [(current + 1) % BANNER_IMAGES.length, 1]);
    }, BANNER_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToBanner = (index: number) => {
    setBannerState(([current]) => [index, index > current ? 1 : -1]);
  };

  return (
    <section
      id="top"
      className="relative isolate min-h-[calc(100vh-3.5rem)] overflow-hidden px-3 pb-16 sm:min-h-[calc(100vh-4rem)] sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={bannerIndex}
            src={BANNER_IMAGES[bannerIndex]}
            alt=""
            custom={direction}
            initial={{ x: direction >= 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: direction >= 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-1 sm:bottom-8">
        {BANNER_IMAGES.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`${index + 1}번째 배너로 이동`}
            onClick={() => goToBanner(index)}
            className="flex items-center justify-center p-3"
          >
            <span
              className={cn(
                'block h-2 rounded-full transition-all duration-300',
                index === bannerIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60',
              )}
            />
          </button>
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(17,24,39,0.12)_0%,rgba(17,24,39,0.34)_45%,rgba(10,10,10,0.68)_100%)]" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom,rgba(120,53,15,0.14),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.35))] sm:h-52" />

      <div className="container relative z-20 mx-auto">
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-4xl flex-col items-center justify-center text-center sm:min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-medium tracking-[0.18em] text-white/85 shadow-sm backdrop-blur-md sm:px-4 sm:text-xs"
          >
            <User2 className="h-4 w-4" />
            ONLY NEUNGGOK MEMBERS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]"
          >
            FC NEUNGGOK
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-2xl !text-sm leading-6 !text-white/80 sm:!text-base sm:leading-7"
          >
            FC 능곡의 공식 커뮤니티에 오신 것을 환영합니다.
          </motion.p>

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
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:bottom-28"
        >
          <Link to="/#home" aria-label="Scroll to home section">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 bg-white/10 p-2 backdrop-blur-md sm:h-12 sm:w-8"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-2 w-1 rounded-full bg-white/60 sm:h-3 sm:w-1.5"
              />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
