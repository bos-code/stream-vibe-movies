import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  build: {
    
      target: "esnext" ,// Allows top-level await
    
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('swiper')) return 'swiper';
              if (id.includes('lodash')) return 'lodash';
              return 'vendor'; // Generic chunk for other modules
            }
          }
        }
      }
  }
  //   plugins: [
  //     imagemin({
  //       gifsicle: {
  //         optimizationLevel: 7,
  //       },
  //       optipng: {
  //         optimizationLevel: 7,
  //       },
  //       mozjpeg: {
  //         quality: 75,
  //       },
  //       pngquant: {
  //         quality: [0.65, 0.9],
  //         speed: 4,
  //       },
  //       svgo: {
  //         plugins: [
  //           {
  //             name: 'removeViewBox',
  //             active: false,
  //           },
  //           {
  //             name: 'addAttributesToSVGElement',
  //             params: {
  //               attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
  //             },
  //           },
  //         ],
  //       },
  //     }),
  //   ],
});
