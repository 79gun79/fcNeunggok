import AuthButton from '@/components/AuthButton';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, BellOff, ChevronRight, LogIn, LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { isIosNonStandalonePwa, requestFcmToken } from '@/lib/messaging';
import { saveFcmToken } from '@/api/fcmTokens';

const navItems = [
  { label: 'Community', to: '/community', comingSoon: false },
  { label: 'Gallery', to: '/gallery', comingSoon: false },
  { label: 'Birthday', to: '/birthday', comingSoon: false },
  { label: 'Point', to: '/point', comingSoon: false },
];

const HomeHeader = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');
  const [isRequestingNotification, setIsRequestingNotification] =
    useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (isRequestingNotification || notificationPermission === 'denied')
      return;
    if (isIosNonStandalonePwa()) {
      sonnerToast.error(
        'iOS에서는 홈 화면에 추가한 후에만 알림을 받을 수 있어요. 공유 버튼에서 "홈 화면에 추가"를 눌러주세요.',
      );
      return;
    }
    setIsRequestingNotification(true);
    try {
      const token = await requestFcmToken();
      if (typeof Notification !== 'undefined') {
        setNotificationPermission(Notification.permission);
      }
      if (!token) {
        sonnerToast.error(
          '알림 권한이 거부되었거나 이 브라우저는 지원하지 않습니다.',
        );
        return;
      }
      const result = await saveFcmToken(token);
      if (!result.success) {
        sonnerToast.error(result.error ?? '알림 등록에 실패했습니다.');
        return;
      }
      sonnerToast.success('알림을 받도록 설정했습니다.');
    } finally {
      setIsRequestingNotification(false);
    }
  };

  const handleNavClick = (to: string) => {
    setIsMobileMenuOpen(false);

    // If the user clicks the current route, provide a sensible UX.
    if (location.pathname === to) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleNavItemClick = (
    item: (typeof navItems)[number],
    event: React.MouseEvent,
  ) => {
    if (item.comingSoon) {
      event.preventDefault();
      setIsMobileMenuOpen(false);
      sonnerToast.info('해당 메뉴는 준비 중입니다.');
      return;
    }

    handleNavClick(item.to);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'unset';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close menu if viewport becomes desktop
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handleChange = () => {
      if (media.matches) setIsMobileMenuOpen(false);
    };

    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const handleMobileLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('로그인 오류:', error.message);
      return;
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('로그아웃 오류:', error.message);
      return;
    }
    setIsMobileMenuOpen(false);
  };

  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in menu */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 top-0 z-[1010] w-full bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] shadow-2xl sm:w-80 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <span className="text-base font-semibold text-white">
                FC 능곡
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Close menu"
                type="button"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="h-[calc(100%-64px)] overflow-y-auto">
              <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(event) => handleNavItemClick(item, event)}
                    className="hover:bg-white/8 group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition-colors active:scale-[0.98]"
                  >
                    <span className="text-base font-medium text-white/90 transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:text-white/70" />
                  </Link>
                ))}
              </nav>

              <div className="space-y-3 p-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  {loading ? (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      로딩 중...
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white/15 bg-white/10">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-transparent text-white">
                            {user.email?.slice(0, 1)?.toUpperCase() ?? 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.user_metadata?.full_name ||
                              user.email?.split('@')[0] ||
                              '사용자'}
                          </p>
                          <p className="truncate text-xs text-white/55">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleMobileLogout}
                        variant="outline"
                        size="sm"
                        className={cn(
                          'border-white/12 bg-white/8 w-full justify-center gap-2 text-white',
                          'hover:bg-rose-500/18 hover:border-rose-300/60 hover:!text-white focus-visible:!text-white',
                          'active:bg-rose-500/22',
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleMobileLogin}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'border-white/12 bg-white/8 w-full justify-center gap-2 text-white',
                        'hover:bg-emerald-500/18 hover:border-emerald-300/60 hover:!text-white focus-visible:!text-white',
                        'active:bg-emerald-500/22',
                      )}
                    >
                      <LogIn className="h-4 w-4" />
                      구글 로그인
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header className="fixed left-3 right-3 top-4 z-50 overflow-hidden rounded-md bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(15,23,42,0.46))] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)] backdrop-blur-xl supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(15,23,42,0.58),rgba(15,23,42,0.32))] sm:left-4 sm:right-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_36%),linear-gradient(90deg,rgba(255,255,255,0.06),transparent_22%,transparent_78%,rgba(255,255,255,0.04))]" />
      <div className="relative mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-4 px-2 sm:h-16 sm:px-4 lg:px-6">
        <Link
          to="/"
          onClick={() => handleNavClick('/')}
          aria-label="FC Neunggok"
          className="flex shrink-0 items-center"
        >
          <span className="h-8 w-16 overflow-hidden sm:h-9 sm:w-20">
            <img
              src="/ng_white.png"
              alt="FC 능곡"
              className="h-full w-full object-contain object-center"
            />
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3 md:gap-5 lg:gap-6">
          <nav className="hidden items-center gap-3 text-sm text-white/70 md:flex lg:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={(event) => handleNavItemClick(item, event)}
                className="hover:bg-white/8 inline-flex items-center gap-1 rounded-md px-4 py-2 transition-colors hover:text-white"
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          {user && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEnableNotifications}
              disabled={
                isRequestingNotification ||
                notificationPermission === 'denied'
              }
              aria-label="알림 받기"
              title={
                notificationPermission === 'denied'
                  ? '브라우저 알림 설정에서 허용해주세요'
                  : notificationPermission === 'granted'
                    ? '알림이 켜져 있습니다'
                    : '알림 받기'
              }
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              {notificationPermission === 'granted' ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="hidden md:block">
            <AuthButton />
          </div>
          <div className="md:hidden">
            <AuthButton
              mobileMenu
              onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>
      {isMounted && createPortal(mobileMenu, document.body)}
    </header>
  );
};

export default HomeHeader;
