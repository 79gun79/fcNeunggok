import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sparkles, Users, HousePlus, MapPin } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "마이 포레스트 104호",
    description: "입실 15:00, 퇴실 11:00",
    link: "http://www.myforestpension.kr/html/sub2_room4.html?menu=2&sub=4",
  },
  {
    icon: Users,
    title: "최대 8인 시설",
    description: "침대 2개, 욕실 1개",
  },
  {
    icon: HousePlus,
    title: "복층 구성",
    description: "취사 가능, 와이파이 존재",
  },
  {
    icon: MapPin,
    title: "위치",
    description: "홍천군 북방면 노일로238번길 53",
    link: "https://map.naver.com/p/search/%EB%A7%88%EC%9D%B4%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8/place/1526857318?placePath=/home?bk_query=%EB%A7%88%EC%9D%B4%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8&entry=pll&fromNxList=true&fromPanelNum=2&timestamp=202601191646&locale=ko&svcName=map_pcv5&searchText=%EB%A7%88%EC%9D%B4%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8&businessCategory=pension&entry=pll&fromNxList=true&fromPanelNum=2&timestamp=202601191646&locale=ko&svcName=map_pcv5&searchText=%EB%A7%88%EC%9D%B4%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8&businessCategory=pension&reviewItem=7207679&from=map&searchType=place&c=15.00,0,0,0,dh",
  },
];

const HighlightsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section className="relative overflow-hidden bg-mountain py-24 text-primary-foreground md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(210_80%_35%_/_0.3),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(195_70%_45%_/_0.2),_transparent_50%)]" />

      <div ref={ref} className="container relative mx-auto px-4">
        <div
          className={`text-center ${
            isVisible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
            Mention Information
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">숙영지 정보</h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            const Wrapper = item.link ? "a" : "div";

            return (
              <div
                key={item.title}
                className={`group text-center ${
                  isVisible ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <Wrapper
                  href={item.link}
                  target={item.link?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.link?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm transition-all 
                    ${
                      item.link
                        ? "cursor-pointer hover:scale-110 hover:bg-primary-foreground/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        : "group-hover:scale-110 group-hover:bg-primary-foreground/20"
                    }`}
                >
                  <Icon className="h-8 w-8" />
                </Wrapper>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-primary-foreground/80">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
