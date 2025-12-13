import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import autoprefixer from "autoprefixer";
import { visualizer } from "rollup-plugin-visualizer";

import { fileURLToPath } from "url";

// Workaround to make "__dirname" defined
// https://stackoverflow.com/a/62892482/16127753
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "firebase-core": ["firebase/app"],
          "firebase-auth": ["firebase/auth"],
          "firebase-firestore": ["firebase/firestore"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    coverage: {
      reporter: ["text", "json", "html"],
    },
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
