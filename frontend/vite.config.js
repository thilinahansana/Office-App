import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// PWA install + offline caching (via the service worker vite-plugin-pwa generates)
// require a secure context: HTTPS, or the special-cased `localhost`. Accessing this
// app from a second device over a plain LAN IP (e.g. http://192.168.1.20:3000) is
// NOT a secure context, so the browser will likely refuse to register the service
// worker there and/or hide the "Install app" prompt. The app still works fine as a
// normal responsive web app in that case — PWA install is a bonus, not a requirement.
// To get PWA behavior over LAN, set up a local cert with mkcert and serve over HTTPS.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Office Data Tracker',
        short_name: 'OfficeApp',
        description: 'Internal bilingual data tracking app',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
