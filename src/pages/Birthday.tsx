import { Helmet } from 'react-helmet-async';
import HomeHeader from '@/components/HomeHeader';
import BirthdaySection from '@/components/BirthdaySection';
import FooterSection from '@/components/FooterSection';

const Birthday = () => {
  return (
    <>
      <Helmet>
        <title>Birthday | FC 능곡 커뮤니티</title>
        <meta name="description" content="FC 능곡 멤버 생일 프로필" />
        <meta property="og:title" content="Birthday | FC 능곡 커뮤니티" />
        <meta property="og:description" content="FC 능곡 멤버 생일 프로필" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen overflow-hidden bg-background">
        <BirthdaySection />
        <FooterSection />
      </main>
    </>
  );
};

export default Birthday;
