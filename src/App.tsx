import { SonnerToaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import Index from './pages/Index';
import Gallery from './pages/Gallery';
import Community from './pages/Community';
import Birthday from './pages/Birthday';
import Point from './pages/Point';

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <SonnerToaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/community" element={<Community />} />
            <Route path="/birthday" element={<Birthday />} />
            <Route path="/point" element={<Point />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
