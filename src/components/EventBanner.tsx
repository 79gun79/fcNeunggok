import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PARTICIPATION_STEPS = [
  { title: '사진 준비', desc: '프로필 사진을 준비해요' },
  { title: '카카오톡 전송', desc: '운영자에게 전송해요' },
  { title: '포인트 감면', desc: '등록 확인 후, 200점 차감돼요' },
];

const EventBanner = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0f0a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,255,77,0.16),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(212,255,77,0.08),transparent_40%)]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-24 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d4ff4d] px-3 py-1 text-xs font-bold tracking-wide text-[#0a0f0a]">
              EVENT
            </span>
            <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/70">
              기간 한정
            </span>
          </div>

          <p className="mt-5 text-base font-medium text-white/80 sm:text-lg">
            프로필 사진을 보내주면
          </p>

          <p className="mt-1 text-4xl font-bold leading-tight text-white sm:text-6xl">
            <span className="text-[#d4ff4d]">200</span>점 감면!
          </p>

          <p className="mt-4 text-xs text-white/50 sm:text-sm">
            사진 1장당 즉시 차감 · 중복 등록 시 최대 1회 적용
          </p>

          <Link
            to="/point"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#d4ff4d] px-6 py-3 text-sm font-semibold text-[#0a0f0a] shadow-[0_20px_40px_-20px_rgba(212,255,77,0.5)] transition-transform hover:scale-[1.03]"
          >
            프로필 확인
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              참여 방법
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              {PARTICIPATION_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4"
                >
                  <span className="text-sm font-bold text-[#d4ff4d]">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-xs font-medium text-white sm:text-sm">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
