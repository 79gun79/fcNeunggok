/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { requestFcmToken } from '@/lib/messaging';
import { saveFcmToken } from '@/api/fcmTokens';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const fcmRegisteredUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      fcmRegisteredUserId.current = null;
      return;
    }
    if (fcmRegisteredUserId.current === user.id) return;
    fcmRegisteredUserId.current = user.id;

    (async () => {
      const token = await requestFcmToken();
      if (!token) return;

      const result = await saveFcmToken(token);
      if (!result.success) {
        console.error('FCM 토큰 저장 실패:', result.error);
      }
    })();
  }, [user]);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // localhost에서 실행 중이면(DEV/PROD 상관없이) 로컬로 돌아오도록 최우선 처리합니다.
    // Supabase Redirect URLs에도 해당 origin(예: http://localhost:8080)을 반드시 등록해야 합니다.
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const redirectTo = isLocalhost
      ? import.meta.env.VITE_DEV_REDIRECT_URL || window.location.origin
      : import.meta.env.VITE_REDIRECT_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
