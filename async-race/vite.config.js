import path, { resolve } from "path";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import checker from "vite-plugin-checker";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
    cssCodeSplit: false,
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    ViteImageOptimizer({
      jpg: {
        quality: 85,
      },
      png: {
        quality: 85,
      },
      webp: {
        quality: 70,
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
