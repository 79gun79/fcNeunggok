import heroImage from "@/assets/ski-resort-hero.png";
import { ChevronDown } from "lucide-react";
import AuthButton from "@/components/AuthButton";

const HeroSection = () => {
  const scrollToContent = () => {
    const element = document.getElementById("resort-info");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-mountain/30 via-transparent to-mountain/70" />
      </div>

      {/* Header with Auth Button */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex justify-end">
          <AuthButton />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-up">
          <p className="mb-4 text-lg tracking-[0.2em] text-white font-bold md:text-2xl">
            FC 능곡
          </p>
          <h1 className="text-5xl font-bold leading-tight text-primary-foreground md:text-7xl lg:text-8xl">
            2026 전지훈련
          </h1>
          <p className="mt-6 text-xl text-primary-foreground md:text-2xl">
            도움 많이 된다. 스트레스 받는다~
          </p>
        </div>

        <div className="absolute bottom-12 animate-fade-in delay-500">
          <button
            onClick={scrollToContent}
            className="group flex flex-col items-center gap-2 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <span className="text-sm tracking-wider">스크롤하여 더 보기</span>
            <ChevronDown className="h-6 w-6 animate-float" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
