import { Helmet } from "react-helmet-async";
import AuthButton from "@/components/AuthButton";
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

      <main className="min-h-screen bg-background">
        <section className="border-b bg-card/80 backdrop-blur">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-primary">
                FC Neunggok
              </p>
              <h1 className="text-3xl font-bold text-foreground">
                FC 능곡 커뮤니티
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                사진 확인, 업로드, 삭제는 로그인 후 이용할 수 있습니다.
              </p>
            </div>
            <AuthButton />
          </div>
        </section>
        <GallerySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Index;
