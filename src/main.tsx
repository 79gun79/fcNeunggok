import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from '@/lib/supabase';

// TEMP DEBUG: RLS auth.uid() 진단용 — 확인 끝나면 제거할 것
(window as unknown as { __debugSupabase: typeof supabase }).__debugSupabase =
  supabase;

createRoot(document.getElementById('root')!).render(<App />);
