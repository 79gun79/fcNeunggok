import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-3 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(137,97,61,0.18),_transparent_55%)] sm:h-[36rem]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.7),transparent_40%)]" />

      <div className="container mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-2 text-[10px] font-medium tracking-[0.18em] text-primary/80 shadow-sm backdrop-blur sm:px-4 sm:text-xs">
              <Sparkles className="h-4 w-4" />
              MEMBERS ONLY COMMUNITY
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                변화의 속도만큼 빠르게
                <span className="text-gradient"> 기록을 정리하세요</span>
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-lg sm:leading-7">
                FC 능곡의 일상과 전지훈련, 함께한 장면들을 한 곳에 모아보는 전용
                커뮤니티입니다. 구글 로그인으로 참여하고, 사진을 업로드하며 기록을
                이어가세요.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-11 rounded-full bg-foreground px-6 text-background shadow-lg shadow-foreground/10 hover:bg-foreground/90"
              >
                <a href="#gallery">Learn more</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-border/70 bg-white/70 px-6 text-foreground shadow-sm backdrop-blur hover:bg-white"
              >
                <a href="#gallery">Request a demo</a>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Archive
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-2xl">
                  Photo Log
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Access
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-2xl">
                  Google Sign-In
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Mood
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-2xl">
                  Premium Brown
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,rgba(137,97,61,0.22),transparent_55%)]" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="luxury-panel overflow-hidden rounded-[1.5rem] p-4 shadow-[0_24px_60px_-28px_rgba(86,57,32,0.45)] sm:rounded-[2rem]">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  Report Preview
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/60 bg-white/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Responses
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">25</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-white/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Moments
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">08</p>
                  </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
                  <div className="h-24 bg-[linear-gradient(90deg,rgba(137,97,61,0.18),rgba(137,97,61,0.06))]" />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/40 bg-[linear-gradient(160deg,rgba(86,57,32,0.95),rgba(137,97,61,0.92))] p-4 text-white shadow-[0_24px_60px_-28px_rgba(86,57,32,0.55)] sm:rounded-[2rem]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_32%)]" />
                <div className="relative space-y-3">
                  <p className="text-xs font-semibold tracking-wide text-white/80">
                    Community Highlights
                  </p>
                  <div className="overflow-hidden rounded-[1.15rem] border border-white/15 bg-black/10">
                    <img
                      src="/ng_main.png"
                      alt="FC 능곡 커뮤니티 대표 이미지"
                      className="h-[170px] w-full object-cover sm:h-[200px]"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                        Curation
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        소중한 장면을 오래 남기는 공간
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/70 p-4 shadow-[0_18px_45px_-26px_rgba(86,57,32,0.35)] backdrop-blur sm:col-span-2 sm:rounded-[2rem]">
                <div className="grid gap-4 sm:grid-cols-[0.55fr_0.45fr] sm:items-center">
                  <div className="overflow-hidden rounded-[1.25rem] border border-border/60">
                    <img
                      src="/img3.png"
                      alt="최근 업로드 사진"
                      className="h-[170px] w-full object-cover sm:h-[190px]"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      Unmoderated story
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground sm:text-base">
                        오늘의 훈련은 어땠나요?
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        사진 한 장과 짧은 설명으로, 팀의 순간을 빠르게 기록하세요.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary/70" />
                      <span className="h-2 w-2 rounded-full bg-primary/40" />
                      <span className="h-2 w-2 rounded-full bg-primary/25" />
                      <span className="h-2 w-2 rounded-full bg-primary/15" />
                      <span className="ml-2 text-xs text-muted-foreground">
                        Noted by members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            Scroll to continue
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
