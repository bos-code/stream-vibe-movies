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
    exclude: ['source-map']
  },
  build: {
    
      target: "esnext" ,// Allows top-level await
    
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('swiper')) return 'swiper';
              return 'vendor'; // Generic chunk for other modules
            }
          }
        }
    
      }
  }
});
