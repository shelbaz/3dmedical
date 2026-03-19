import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-core": ["three"],
          "r3f": ["@react-three/fiber", "@react-three/drei"],
          "postprocessing": ["@react-three/postprocessing", "postprocessing"],
        },
      },
    },
  },
});
