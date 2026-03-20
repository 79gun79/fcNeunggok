import { Mail, Instagram } from "lucide-react";

const FooterSection = () => {
  return (
    <footer
      id="footer"
      className="scroll-mt-24 px-3 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="overflow-hidden rounded-[1.5rem] border border-[#6f4d2e]/20 bg-[linear-gradient(145deg,#3a2616,#563920_48%,#89613D)] px-4 py-8 text-white shadow-[0_28px_70px_-32px_rgba(58,38,22,0.8)] sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              FC 능곡 커뮤니티
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              능곡인들을 위한 전용 커뮤니티로, 함께한 순간들을 사진으로
              기록하고 공유하는 공간입니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">커뮤니티 안내</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/75 sm:text-base">
              <li>로그인 후 사진 업로드와 삭제가 가능합니다.</li>
              <li>커뮤니티 사진은 멤버들과 함께 공유됩니다.</li>
              <li>소중한 기록이 오래 남을 수 있도록 함께 관리해주세요.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">사이트 문의</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/75 sm:text-base">
              <li className="flex items-center justify-center gap-3 md:justify-start">
                <Mail className="h-5 w-5 text-white" />
                <span>79gun79@naver.com</span>
              </li>
              <li className="flex items-center justify-center gap-3 md:justify-start">
                <Instagram className="h-5 w-5 text-white" />
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

        <div className="mt-8 border-t border-white/15 pt-5 text-center text-xs leading-5 text-white/60 sm:mt-10 sm:pt-6 sm:text-sm">
          <p>© 2026 FC 능곡 커뮤니티. 함께한 장면을 오래 남기는 프라이빗 아카이브.</p>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
