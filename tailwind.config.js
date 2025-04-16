/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}","!./node_modules/**/*.{html,js}"],
  theme: {
    extend: {

        boxShadow: {
          fancy: '0px 10px 30px rgba(0, 0, 0, 0.25)',
        },

      colors: {
        // Farger fra styleguiden
        black: "#252625",
        brown: "#514439",
        beige: "#DBB391",
        olive: "#AAA668",
        white: "#FFFFFF",
        blue: "#4D8FB8",
        lightblue: "#A0DBF8",
        red: "#9C0000",

        text: {
          default: "#252625",
          light: "#FFFFFF",
        },

        button: {
          prime: "#4D8FB8",
          secondary: "#AAA668",
          third: "#8C6C45",
          four: "#DBB391",
          white: "#FFFFFF",
        },

        // Hover states = white bg with original color as text
        hover: {
          primeText: "#4D8FB8",
          secondaryText: "#AAA668",
          thirdText: "#8C6C45",
          fourText: "#DBB391",
        },
      },
      fontFamily: {
        heading: ['Inter', 'serif'],
        body: ['Playfair Display', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', '2.5rem'],
        h2: ['1.875rem', '2.25rem'],
        h3: ['1.5rem', '2rem'],
        textLg: ['1.25rem', '1.75rem'],
        textBase: ['1rem', '1.5rem'],
        textSm: ['0.875rem', '1.25rem'],
      },
      backgroundImage: {
        'login-bg': "url('/assets/bg_login.jpg')",
        'reg-bg': "url('/assets/bg_reg.jpeg')"
      },
    },
  },
  plugins: [],
};