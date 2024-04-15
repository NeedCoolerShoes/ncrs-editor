/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html,js}",
    "./scripts/**/*.{html,js}",
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        icon: ['icon', 'sans-serif'],
      },
      colors: {
        'ncs-brown': '#926602',
        'ncs-light-gray': {
          200: "#aaaaaa"
        },
        'ncs-gray': {
          200: "#3f4244",
          300: "#383b3d",
          400: "#313436",
          500: "#262a2e",
          600: "#232428",
          700: "#1f2326",
          800: "#1a1a1a",
          900: "#131315"

        },
        'ncs-yellow': {
          200: "#f5f8cc"
        },
        'ncs-blue': {
          800: '#0f1e3a'
        }
      },
      maxWidth: {
        'ncs-content': "998px"
      },
      screens: {
        touch: {raw: "(any-pointer: coarse)"}
      }
    },
  },
  plugins: [],
}

