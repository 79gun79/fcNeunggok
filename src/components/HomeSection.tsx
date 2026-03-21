import { CalendarDays, ShieldCheck, Users } from 'lucide-react';

export default function HomeSection() {
  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-hidden px-3 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              COMMUNITY
            </p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              능곡 멤버들을 위한 공간
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              함께한 순간을 기록하고 공유하는 곳. 곧 더 많은 기능이 추가됩니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]">
                  <Users className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  멤버 전용
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                로그인 후 사진 업로드/삭제 등 멤버 기능을 사용할 수 있어요.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-slate-900">기록</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                경기와 일상의 순간들을 갤러리에 모아 추억을 이어가요.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-slate-900">안정성</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                안전한 인증(Supabase) 기반으로 운영됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
