import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'SmartClicks.AI',
        short_name: 'SmartClicks',
        theme_color: '#3B82F6',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    ViteImageOptimizer({
      jpg: {
        quality: 80
      },
      png: {
        quality: 80
      },
      webp: {
        lossless: true
      }
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024
    }),
    sentryVitePlugin({
      org: "smartclicks",
      project: "javascript-react"
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'recharts'],
          utils: ['date-fns', '@supabase/supabase-js']
        }
      }
    },
    sourcemap: true,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    cors: true,
    port: 3000
  }
});