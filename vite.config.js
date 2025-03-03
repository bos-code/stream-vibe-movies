import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  optimizeDeps: {
    include: ["core-js/stable"],

    exclude: ["node_modules"]
  },
  build: {
    target: "esnext", // Allows top-level await

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Moves all node_modules dependencies to a separate chunk
          }
          if (id.includes("largeModule.js")) {
            return "large-module"; // Moves specific large file to its own chunk
          }
        }
      }
    }
  }
});
