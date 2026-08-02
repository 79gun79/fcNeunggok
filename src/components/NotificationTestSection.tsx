import { useState } from 'react';
import { Bell } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { requestFcmToken } from '@/lib/messaging';
import { Button } from '@/components/ui/button';

// FCM 연동 테스트용 임시 섹션 — 확인 끝나면 제거 예정.
const NotificationTestSection = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      const fcmToken = await requestFcmToken();
      if (!fcmToken) {
        sonnerToast.error(
          '알림 권한을 허용하지 않았거나 토큰 발급에 실패했습니다.',
        );
        return;
      }
      setToken(fcmToken);
      sonnerToast.success('FCM 토큰을 발급받았습니다.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <section className="px-3 py-10 sm:px-6 lg:px-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-dashed border-slate-300 bg-white/60 p-5 sm:p-8">
          <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
            TEST
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">
            푸시 알림 테스트
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            버튼을 눌러 알림 권한을 요청하고 FCM 토큰을 발급받아 보세요.
          </p>

          <Button
            type="button"
            className="mt-4"
            onClick={handleRequest}
            disabled={isRequesting}
          >
            <Bell className="mr-2 h-4 w-4" />
            알림 받기 테스트
          </Button>

          {token && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">발급된 토큰</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-800">
                {token}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotificationTestSection;
