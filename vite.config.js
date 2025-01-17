import { defineConfig } from "vite";
import imagemin from 'vite-plugin-imagemin';


export default defineConfig({
  
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
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
