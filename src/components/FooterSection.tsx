import { Phone, Mail, Instagram } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              2026 전지훈련
            </h3>
            <p className="mt-4 text-muted-foreground">
              브로들과 함께하는 의미있는 겨울 전지훈련
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">사이트 문의</h4>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              {/* <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>010-2834-1722</span>
              </li> */}
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>79gun79@naver.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-primary" />
                <a href="https://www.instagram.com/j_gun2/">j_gun2</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">관련 정보</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>주간: 09:00 - 17:30</li>
              <li>야간: 19:00 - 23:00</li>
              <li>심야: 23:00 - 03:00</li>
              <li>
                <a href="https://www.sonohotelsresorts.com/skiboard">
                  스키장 정보 바로가기
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            @ 2026. 이재건 All pictures cannot be copied without permission.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
