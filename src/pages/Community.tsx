import { Helmet } from 'react-helmet-async';
import HomeHeader from '@/components/HomeHeader';
import FooterSection from '@/components/FooterSection';
import CommunitySection from '@/components/CommunitySection';

const Community = () => {
  return (
    <>
      <Helmet>
        <title>Community | FC 능곡 커뮤니티</title>
        <meta name="description" content="FC 능곡 커뮤니티" />
        <meta property="og:title" content="Community | FC 능곡 커뮤니티" />
        <meta property="og:description" content="FC 능곡 커뮤니티" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen overflow-hidden bg-background">
        <CommunitySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Community;
