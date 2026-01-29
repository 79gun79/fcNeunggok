import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Sun,
  Moon,
  Coffee,
  Utensils,
  Snowflake,
  Home,
  Car,
  Flag,
  CableCar,
} from "lucide-react";

const day1Schedule = [
  {
    time: "09:00",
    title: "출발",
    description: "시흥에서 집합 후, 출발",
    icon: Car,
  },
  {
    time: "10:00",
    title: "아점 식사",
    description: "휴게소에서 식사 해결",
    icon: Utensils,
  },
  {
    time: "11:30",
    title: "렌탈샵 도착",
    description: "스마일 렌탈샵 도착",
    icon: Flag,
    link: "https://smileskis.imweb.me/PackageInformation",
  },

  {
    time: "12:00",
    title: "주간 훈련",
    description: "4시간 스키 예정",
    icon: CableCar,
    link: "https://www.sonohotelsresorts.com/skiboard/status",
  },
  {
    time: "17:00",
    title: "숙소 도착",
    description: "스키 후, 숙소 체크인",
    icon: Home,
    link: "http://www.myforestpension.kr/html/sub2_room4.html?menu=2&sub=4",
  },
  {
    time: "18:00",
    title: "저녁 식사",
    description: "많이 먹어둬야 도움 많이 된다",
    icon: Utensils,
  },
  {
    time: "23:00",
    title: "야간 훈련",
    description: "4시간 스키 예정",
    icon: CableCar,
    link: "https://www.sonohotelsresorts.com/skiboard/status",
  },
];

const day2Schedule = [
  {
    time: "03:00",
    title: "취침",
    description: "야간 훈련 종료 후, 숙면",
    icon: Moon,
  },
  {
    time: "11:00",
    title: "숙소 퇴실",
    description: "기상 후, 체크아웃",
    icon: Home,
  },
  {
    time: "12:00",
    title: "점심 식사",
    description: "오늘 섭취 많이 된다",
    icon: Utensils,
  },
  {
    time: "13:00",
    title: "복귀",
    description: "시흥 복귀 준비",
    icon: Car,
  },
  { time: "15:30", title: "도착", description: "안전하게 귀가", icon: Sun },
];

interface ScheduleCardProps {
  schedule: typeof day1Schedule;
  dayNumber: number;
  isVisible: boolean;
  animationDirection: "left" | "right";
}

const ScheduleCard = ({
  schedule,
  dayNumber,
  isVisible,
  animationDirection,
}: ScheduleCardProps) => (
  <div
    className={`glass-card rounded-3xl p-8 md:p-10 ${
      isVisible
        ? animationDirection === "left"
          ? "animate-slide-right"
          : "animate-slide-left"
        : "opacity-0"
    }`}
  >
    <div className="mb-8 flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <span className="text-2xl font-bold">D{dayNumber}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Day {dayNumber}
        </p>
        <h3 className="text-2xl font-bold text-foreground">
          {dayNumber === 1 ? "1월 27일" : "1월 28일"}
        </h3>
      </div>
    </div>

    <div className="space-y-6">
      {schedule.map((item, index) => {
        const Icon = item.icon;

        const IconWrapper = item.link ? "a" : "div";

        return (
          <div key={index} className="group flex gap-4">
            <div className="flex flex-col items-center">
              <IconWrapper
                href={item.link}
                target={item.link?.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.link?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all 
                  ${
                    item.link
                      ? "cursor-pointer hover:scale-110 hover:bg-secondary hover:text-primary-foreground shadow-md"
                      : "group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
              </IconWrapper>
              {index < schedule.length - 1 && (
                <div className="mt-2 h-full w-px bg-border" />
              )}
            </div>
            <div className="pb-6">
              <span className="text-sm font-semibold text-primary">
                {item.time}
              </span>
              <h4 className="mt-1 text-lg font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-1 text-muted-foreground">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const ScheduleSection = () => {
  const { ref: ref1, isVisible: isVisible1 } = useScrollReveal(0.1);
  const { ref: ref2, isVisible: isVisible2 } = useScrollReveal(0.1);

  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Training Schedule
          </p>
          <h2 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
            훈련 일정
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            훈련 도움 된다 도움 주는 거야~
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div ref={ref1}>
            <ScheduleCard
              schedule={day1Schedule}
              dayNumber={1}
              isVisible={isVisible1}
              animationDirection="left"
            />
          </div>
          <div ref={ref2}>
            <ScheduleCard
              schedule={day2Schedule}
              dayNumber={2}
              isVisible={isVisible2}
              animationDirection="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
