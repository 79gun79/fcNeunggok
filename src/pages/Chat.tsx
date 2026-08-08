import { Helmet } from 'react-helmet-async';
import HomeHeader from '@/components/HomeHeader';
import ChatSection from '@/components/ChatSection';

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>Chat | FC 능곡 커뮤니티</title>
        <meta name="description" content="FC 능곡 AI 챗봇" />
        <meta property="og:title" content="Chat | FC 능곡 커뮤니티" />
        <meta property="og:description" content="FC 능곡 AI 챗봇" />
        <meta property="og:image" content="/ng_main.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHeader />
      <main className="min-h-screen bg-background pt-14 sm:pt-16">
        <ChatSection />
      </main>
    </>
  );
};

export default Chat;
