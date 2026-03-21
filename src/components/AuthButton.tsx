import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Menu, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const headerButtonClassName =
  'w-full rounded-md border border-white/12 bg-white/8 px-4 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-white/20 hover:bg-white/14 hover:text-white sm:w-auto';

const headerIconButtonClassName =
  'rounded-full border border-transparent bg-white/8 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-white/70 hover:bg-white/14 hover:text-white data-[state=open]:border-white/70 data-[state=open]:bg-white/16 data-[state=open]:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.75)]';

type AuthButtonProps = {
  mobileMenu?: boolean;
  onMobileMenuOpen?: () => void;
};

const AuthButton: React.FC<AuthButtonProps> = ({
  mobileMenu = false,
  onMobileMenuOpen,
}) => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('로그인 오류:', error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('로그아웃 오류:', error.message);
    }
  };

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={headerButtonClassName}
      >
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        로딩 중...
      </Button>
    );
  }

  if (mobileMenu) {
    return (
      <Button
        onClick={onMobileMenuOpen}
        variant="outline"
        size="icon"
        type="button"
        aria-label="모바일 메뉴 열기"
        className={headerIconButtonClassName}
      >
        {user ? (
          <Avatar className="h-8 w-8 border border-white/15 bg-white/10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-transparent text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        onClick={handleSignIn}
        variant="outline"
        size="sm"
        className={
          headerButtonClassName +
          ' hover:bg-emerald-500/18 active:bg-emerald-500/22 hover:border-emerald-300/60'
        }
      >
        <LogIn className="mr-2 h-4 w-4" />
        구글 로그인
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="프로필 메뉴"
          className={headerIconButtonClassName}
        >
          <Avatar className="h-8 w-8 border border-white/15 bg-white/10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-transparent text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        alignOffset={-4}
        collisionPadding={24}
        className="w-[min(13rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.92))] p-2 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-2xl [--accent-foreground:210_40%_98%] [--accent:215_28%_17%] sm:w-52"
      >
        <div className="px-2 py-2">
          <div className="truncate text-sm font-semibold text-white">
            {user.user_metadata?.full_name ||
              user.email?.split('@')[0] ||
              '사용자'}
          </div>
          <div className="truncate text-xs text-white/55">{user.email}</div>
        </div>
        <DropdownMenuSeparator className="bg-white/8" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="!text-white/88 hover:!bg-rose-500/18 focus:!bg-rose-500/18 data-[highlighted]:!bg-rose-500/18 cursor-pointer rounded-lg transition-colors hover:!text-rose-50 focus:!text-rose-50 data-[highlighted]:!text-rose-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
