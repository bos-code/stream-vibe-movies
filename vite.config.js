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
      external: ["fsevents"]
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
