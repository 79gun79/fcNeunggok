import { Helmet } from 'react-helmet-async';
import HomeHeader from '@/components/HomeHeader';
import PointSection from '@/components/PointSection';
import NotificationTestSection from '@/components/NotificationTestSection';
import FooterSection from '@/components/FooterSection';

const Point = () => {
  return (
    <>
      <Helmet>
        <title>Point | FC 능곡 커뮤니티</title>
        <meta name="description" content="FC 능곡 멤버 포인트 순위표" />
        <meta property="og:title" content="Point | FC 능곡 커뮤니티" />
        <meta property="og:description" content="FC 능곡 멤버 포인트 순위표" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen overflow-hidden bg-background">
        <PointSection />
        <NotificationTestSection />
        <FooterSection />
      </main>
    </>
  );
};

export default Point;
