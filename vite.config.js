import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aktifkan autoUpdate di dev
      includeAssets: ["/logo-google.png", "/logo.png", "/vite.svg"],
      manifest: {
        name: "URL Shortener",
        short_name: "Shortener",
        description: "A simple URL shortening app",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-google.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
        theme_color: "#ffffff",
        background_color: "#f8f9fa",
        display: "standalone",
        scope: "/",
        start_url: "/",
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
        type: "module", // Use module-based service worker
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});