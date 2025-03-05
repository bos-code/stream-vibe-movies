import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import htmlMinify from "vite-plugin-html-minify";

const htmlFiles = fs
  .readdirSync("./") // this reads all files in the project folder
  .filter((file) => file.endsWith(".html")) // this selects all html files by matching it by extension
  .reduce((entries, file) => {
    entries[file.replace(".html", "")] = resolve(__dirname, file);
    return entries;
  }, {}); // this adds all html files to a map of filename -> path

export default defineConfig({
  plugins: [htmlMinify()], // compresses output html files
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
      input: htmlFiles, // adds the map to rollup bundler
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
