import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: "Guyub Rukun RT 01",
          short_name: "Guyub Rukun",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#0d9488",
          description: "Aplikasi Guyub Rukun untuk warga RT 01",
          icons: [
            {
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2314B8A6' stroke='%230F766E' strokeWidth='2'/%3E%3Cpath d='M50 20 Q60 40, 50 60 Q40 40, 50 20' fill='%230F766E' /%3E%3Ccircle cx='35' cy='40' r='10' fill='%230F766E'/%3E%3Ccircle cx='65' cy='40' r='10' fill='%230F766E'/%3E%3C/svg%3E",
              sizes: "192x192 512x512",
              type: "image/svg+xml"
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
