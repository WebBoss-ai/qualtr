import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Explicitly define the API base URL for proxying
const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias for easy imports
    },
  },
  build: {
    outDir: 'build', // Output directory for build
  },
  server: {
    proxy: {
      // Proxying API requests
      '/api1': {
        target: API_BASE_URL, // FastAPI backend at localhost:8000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api1/, ''), // Keep the '/api' path in the backend call
      },
    },
  },
});
