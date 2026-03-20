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
        className="w-full rounded-full border-primary/20 bg-white/70 px-4 text-foreground sm:w-auto sm:px-5"
      >
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
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
        className="w-full rounded-full border-primary/15 bg-white/75 px-4 text-foreground shadow-sm backdrop-blur hover:bg-primary hover:text-primary-foreground sm:w-auto sm:px-5"
      >
        <LogIn className="mr-2 h-4 w-4" />
        구글 로그인
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center justify-center gap-2 rounded-full border-primary/15 bg-white/75 px-3 text-foreground shadow-sm backdrop-blur hover:bg-white sm:w-auto sm:justify-start"
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[8rem] truncate sm:max-w-[10rem]">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(14rem,calc(100vw-1.5rem))] rounded-2xl border-border/70 bg-white/95 p-2 shadow-xl sm:w-56">
        <div className="px-2 py-2 text-sm text-muted-foreground">
          {user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-xl">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
