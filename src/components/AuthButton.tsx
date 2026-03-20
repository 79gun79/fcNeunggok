import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
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

const AuthButton: React.FC = () => {
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

  if (!user) {
    return (
      <Button
        onClick={handleSignIn}
        variant="outline"
        size="sm"
        className={headerButtonClassName}
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
          size="sm"
          className="border-white/12 bg-white/8 hover:bg-white/14 data-[state=open]:bg-white/16 flex w-full items-center justify-center gap-2 rounded-md border px-3 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-white/20 hover:text-white data-[state=open]:border-white/20 data-[state=open]:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.75)] sm:w-auto sm:justify-start"
        >
          <Avatar className="h-6 w-6 border border-white/15 bg-white/10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-transparent text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[8rem] truncate sm:max-w-[10rem]">
            {user.user_metadata?.full_name ||
              user.email?.split('@')[0] ||
              '사용자'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        alignOffset={-4}
        collisionPadding={24}
        className="w-[min(13rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.92))] p-2 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:w-52"
      >
        <div className="px-2 py-2 text-sm text-white/55">{user.email}</div>
        <DropdownMenuSeparator className="bg-white/8" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-white/88 hover:bg-white/8 cursor-pointer rounded-lg transition-colors hover:text-white focus:bg-white/10 focus:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
