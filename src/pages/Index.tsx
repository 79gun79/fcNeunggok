import { Helmet } from "react-helmet-async";
import HomeHeader from "@/components/HomeHeader";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";
import GallerySection from "@/components/GallerySecction";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>FC 능곡 커뮤니티</title>
        <meta
          name="description"
          content="능곡인들을 위한 전용 커뮤니티"
        />
        <meta property="og:title" content="FC 능곡 커뮤니티" />
        <meta property="og:description" content="능곡인들을 위한 전용 커뮤니티" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FC 능곡 커뮤니티" />
        <meta name="twitter:description" content="능곡인들을 위한 전용 커뮤니티" />
        <meta name="twitter:image" content="/ng_main.png" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen overflow-hidden bg-background">
        <HeroSection />
        <GallerySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Index;
