import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: "http://localhost:8000",
          ws: true,
        },
      },
    },
    build: {
      outDir: "dist",
    },
    // Only needed for React Router apps (SPA)
    // Redirects unknown paths to index.html
    // Helps with direct URL access like /dashboard
    optimizeDeps: {
      include: ["socket.io-client"],
    },
    define: {
      "process.env": {}, // avoid "process is not defined" in browser
    },
  };
});
