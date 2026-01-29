import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MapPin, Mountain, Clock, Thermometer } from "lucide-react";

const infoCards = [
  {
    icon: MapPin,
    title: "위치",
    description: "강원도 홍천 서면",
    detail: "차량으로 약 2시간 소요",
  },
  {
    icon: Mountain,
    title: "슬로프",
    description: "11개 코스",
    detail: "초급부터 최상급까지",
  },
  {
    icon: Clock,
    title: "운영 시간",
    description: "09:00 - 03:00",
    detail: "심야 스키 가능",
  },
  {
    icon: Thermometer,
    title: "평균 기온",
    description: "-5°C ~ -15°C",
    detail: "최상의 설질 보장",
  },
];

const ResortInfoSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="resort-info" className="bg-background py-24 md:py-32">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`text-center ${
            isVisible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Place Information
          </p>
          <h2 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
            비발디 파크
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            스키 타는거 운동 많이 된다~
            <br />
            자기 전에 많이 생각 날꺼야~
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`glass-card group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${
                  isVisible ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {card.description}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResortInfoSection;
