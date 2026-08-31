/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FFFDF9',
          card: '#FFFFFF',
          darkBg: '#121316',
          darkCard: '#1C1D21',
          black: '#0A0A0A',
          yellow: '#FFDF00',
          orange: '#FF6B35',
          terracotta: '#E85D35',
          mint: '#5AE4A8',
          cyan: '#48CAE4',
          purple: '#BDB2FF',
          pink: '#FF70A6',
          lime: '#A7F365',
        },
        sand: {
          50: '#FAF7F2',
          100: '#F5EFEB',
          200: '#EBDDCE',
          300: '#DDC7AF',
          400: '#CCA88A',
          500: '#B88A64',
          600: '#9B6C47',
          700: '#7B5134',
          800: '#5F3D27',
          900: '#3D2517',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FBEBE5',
          200: '#F6D5C8',
          300: '#EEB5A3',
          400: '#E28A6E',
          500: '#D96B43',
          600: '#C25127',
          700: '#9E3C1A',
          800: '#7E3117',
          900: '#53200F',
        },
        clay: {
          500: '#9A8367',
          600: '#7C674E',
          700: '#5F4D3A',
          800: '#453629',
          900: '#2A2018',
        },
        dusk: {
          700: '#2B2C30',
          800: '#222326',
          850: '#1C1D20',
          900: '#161719',
          950: '#0E0F10',
        },
        sage: {
          300: '#A3B89E',
          400: '#8DA687',
          500: '#7E9979',
          600: '#647E5F',
          700: '#4F654B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #0A0A0A',
        'neo': '4px 4px 0px 0px #0A0A0A',
        'neo-lg': '6px 6px 0px 0px #0A0A0A',
        'neo-xl': '8px 8px 0px 0px #0A0A0A',
        'neo-dark-sm': '2px 2px 0px 0px #FFFFFF',
        'neo-dark': '4px 4px 0px 0px #FFFFFF',
        'neo-dark-lg': '6px 6px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
