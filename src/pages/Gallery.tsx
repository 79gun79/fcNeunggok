import { Helmet } from 'react-helmet-async';
import HomeHeader from '@/components/HomeHeader';
import GallerySection from '@/components/GallerySecction';
import FooterSection from '@/components/FooterSection';

const Gallery = () => {
  return (
    <>
      <Helmet>
        <title>Gallery | FC 능곡 커뮤니티</title>
        <meta name="description" content="FC 능곡 사진 갤러리" />
        <meta property="og:title" content="Gallery | FC 능곡 커뮤니티" />
        <meta property="og:description" content="FC 능곡 사진 갤러리" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen overflow-hidden bg-background">
        <GallerySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Gallery;
