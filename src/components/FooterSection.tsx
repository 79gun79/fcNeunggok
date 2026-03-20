import { Mail, Instagram } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer
      id="footer"
      className="mt-8 scroll-mt-24 border-t border-slate-200/80 bg-[#08111f] pb-8 pt-16 sm:mt-12 sm:pb-10 sm:pt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 text-left md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] md:items-start md:gap-10 lg:gap-16 lg:pb-12">
          <div className="md:pr-8 lg:pr-12">
            <img
              src="/ng_white.png"
              alt="FC 능곡 커뮤니티"
              className="h-14 w-auto object-contain sm:h-16"
            />
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              능곡인들을 위한 전용 커뮤니티로,
              <br />
              함께한 순간들을 사진으로 기록하고 공유하는 공간입니다.
            </p>
          </div>

          <div className="md:justify-self-end md:text-right lg:min-w-[320px]">
            <h4 className="font-semibold text-white">사이트 문의</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300 sm:text-base">
              <li className="flex items-center justify-start gap-3 md:justify-end">
                <Mail className="h-5 w-5 text-slate-100" />
                <a
                  href="mailto:79gun79@naver.com"
                  className="transition-colors hover:text-white"
                >
                  79gun79@naver.com
                </a>
              </li>
              <li className="flex items-center justify-start gap-3 md:justify-end">
                <Instagram className="h-5 w-5 text-slate-100" />
                <a
                  href="https://www.instagram.com/j_gun2/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  j_gun2
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-left text-xs leading-5 text-slate-400 sm:pt-6 sm:text-sm md:flex-row md:items-center md:justify-between">
          <p>© 2026 Jaegeon Lee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
