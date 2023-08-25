/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './index.html',
    './src/**/*.tsx',
    './components/**/*.tsx',
    './components/*.tsx',
    './src/*.tsx',
  ],
  theme: {
    screens: {
      tablet: '640px',
      // => @media en un futuro 950px y menu circular desplegable para mas pequeñas

      laptop: '1200px',
      // => @media (min-width: 1024px)

      desktop: '3435px',
      // => @media (min-width: 1280px)
    },
    extend: {
      colors: {
        'dark-blue': '#3C476E',
        'light-blue': '#6386A1',
        'main-gray': '#AAAAAA',
        'input-gray': '#a9afc1',
        'shadow-gray': 'rgb(170, 170, 170)',
        'main-red': '#FF0000',
        'C/Color1': 'var(--color1)', //inicial=blanco
        'C/Color2': 'var(--color2)', //ini=azulclaro
        'C/Color3': 'var(--color3)', //azuloscuro
        'C/Color4': 'var(--color4)', //gris
        'C/Color5': 'var(--color5)', //negro
        'C/Color6': 'var(--color6)', //negro
        'C/Color7': 'var(--color7)', //negro
        'C/Color8': 'var(--color8)', //negro
        'C/Color9': 'var(--color9)', //negro
      },
      backgroundImage: {
        mainSalgar: 'url(/assets/main/ambiente-live-matt-monterrey-blue-night-1000_l.png)',
        bgIni: 'var(--urlBgIni)',
      },
      boxShadow: {
        xs: '2px 2px 2.5px rgba(0, 0, 0, 0.5)',
        xl: '8px 8px 10px rgba(0, 0, 0, 0.5)',
        m: '4px 4px 5px rgba(0, 0, 0, 0.5)',
        l: '6px 6px 8px rgba(0, 0, 0, 0.5)',
        xll: '10px 10px 12px rgba(0, 0, 0, 0.5)',
      },
      gridTemplateAreas: {
        register: ['area1 area1 area2 area2', 'area1 area1 area2 area2', 'area3 area3 area3 area4'],
      },
      fontFamily: {
        calibri: ['Calibri'],
      },
    },
  },
  plugins: [require('@savvywombat/tailwindcss-grid-areas')],
}
export {}
