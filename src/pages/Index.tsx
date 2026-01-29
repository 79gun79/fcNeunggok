import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import ResortInfoSection from "@/components/ResortInfoSection";
import ScheduleSection from "@/components/ScheduleSection";
import HighlightsSection from "@/components/HighlightsSection";
import FooterSection from "@/components/FooterSection";
import GallerySection from "@/components/GallerySecction";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>2026 전지훈련 | FC 능곡</title>
        <meta
          name="description"
          content="국내 최고의 스키 리조트에서 1박 2일 특별한 겨울 여행을 즐겨보세요. 프리미엄 장비, 전문 강습, 야간 스키까지 모든 것이 포함되어 있습니다."
        />
      </Helmet>

      <main className="min-h-screen">
        <HeroSection />
        <ResortInfoSection />
        <ScheduleSection />
        <HighlightsSection />
        <GallerySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Index;
