import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 minutes cache default
      refetchOnWindowFocus: false,
    },
  },
});

// Gracefully handle and ignore benign Vite WebSocket/HMR disconnect errors in sandboxed environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason || '';
    const reasonStr = typeof reason === 'string' ? reason : (reason.message || '');
    if (
      reasonStr.includes('WebSocket') || 
      reasonStr.includes('vite') || 
      reasonStr.includes('ws://') || 
      reasonStr.includes('wss://')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('WebSocket') || 
      msg.includes('vite') || 
      msg.includes('ws://') || 
      msg.includes('wss://')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

