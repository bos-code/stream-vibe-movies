/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{html,js}',
      './index.html',
    ],
    
    theme: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'black': '#000',
        'white': '#fff',
        'red45': '#e50000',
        'red50': '#ff0000',
        'red55': '#ff1919',
        'red60': '#ff3333',
        'red65': '#ff4d4d',
        'red80': '#ff9999',
        'red90': '#ffcccc',
        'red95': '#ffe5e5',
        'red99': '#fffafa',
        'bk06': '#0f0f0f',
        'bk08': '#141414',
        'bk08-trans': '#1414147a',
        'bk10': '#1a1a1a',
        'bk12': '#1f1f1f',
        'bk15': '#262626',
        'bk20': '#333333',
        'bk25': '#404040',
        'bk30': '#4d4d4d',

        'gray60': '#696969',
        'gray65': '#a6a6a6',
        'gray70': '#b3b3b3',
        'gray75': '#bfbfbf',
        'gray90': '#e4e4e7',
        'gray95': '#f1f1f3',
        'gray97': '#f7f7f8',
        'gray99': '#fcfcfd',




    


        },
        screens: {
          xsm: '360px',
          sm: '480px',
          md: '768px',
          lg: '976px',
          xl: '1440px',
          lp: '1600px'
        },
      plugins: [
      ],
    }
  }