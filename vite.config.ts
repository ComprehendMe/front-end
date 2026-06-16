import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const host = req.headers.host;
            if (host) {
              proxyReq.setHeader('x-forwarded-host', host);
              proxyReq.setHeader('x-forwarded-proto', 'http');
            }
          });
        },
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo192.webp', 'logo512.webp', 'robots.txt'],
      manifest: {
        name: 'ComprehendMe',
        short_name: 'ComprehendMe',
        description: 'AI-powered clinical conversation analysis',
        theme_color: '#1497D2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'logo192.webp',
            sizes: '192x192',
            type: 'image/webp',
          },
          {
            src: 'logo512.webp',
            sizes: '512x512',
            type: 'image/webp',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg,jpg,jpeg,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
            },
          },
        ],
      },
    }),
    ...(process.env.ANALYZE
      ? [
          visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
          }) as import('vite').PluginOption,
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-tanstack';
          }
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react') || id.includes('node_modules/embla-carousel') || id.includes('node_modules/next-themes') || id.includes('node_modules/sonner') || id.includes('node_modules/react-hook-form') || id.includes('node_modules/react-day-picker')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-date';
          }
          if (id.includes('node_modules/zod') || id.includes('node_modules/@hookform')) {
            return 'vendor-validation';
          }
          if (id.includes('node_modules/tailwind-merge') || id.includes('node_modules/class-variance-authority') || id.includes('node_modules/clsx') || id.includes('node_modules/tw-animate-css')) {
            return 'vendor-utils';
          }
        },
      },
    },
  },
})
