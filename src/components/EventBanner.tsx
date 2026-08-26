import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PARTICIPATION_STEPS = [
  { title: '계정 준비', desc: '가입할 구글 계정을 준비해요' },
  { title: '계정 가입', desc: '로그인 버튼을 눌러 가입해요' },
  { title: '포인트 감면', desc: '등록 확인 후, 200점 감면' },
];

const EventBanner = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0f0a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,59,59,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,59,59,0.1),transparent_40%)]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-24 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#ff3b3b] px-3 py-1 text-xs font-bold tracking-wide text-white">
              EVENT
            </span>
            <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/70">
              기간 한정
            </span>
          </div>

          <p className="mt-5 text-base font-medium text-white/80 sm:text-lg">
            지금 바로 FC 능곡 계정 가입하면
          </p>

          <p className="mt-1 text-4xl font-bold leading-tight text-white sm:text-6xl">
            <span className="text-[#ff3b3b]">200</span>점 감면!
          </p>

          <p className="mt-4 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 sm:text-sm">
            기존 등록된 멤버는{' '}
            <span className="mx-1 font-bold text-[#ff3b3b]">300점 감면</span>
            입니다.
          </p>

          <Link
            to="/point"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#ff3b3b] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(255,59,59,0.5)] transition-transform hover:scale-[1.03]"
          >
            출석 고고
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
                  <span className="text-sm font-bold text-[#ff3b3b]">
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
