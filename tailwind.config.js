/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}","!./node_modules/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        text: {
          base: "#252625",
          inverted: "#FFFFFF",
        },
        background: {
          primary: "#8C6C45",
          secondary: "#DBB391",
          light: "#FFFFFF",
        },
        accent: {
          olive: "#AAA668",
          sky: "#A0DBF8",
        },
        brand: {
          blue: "#A0DBF8",
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', '2.5rem'], // 36px
        h2: ['1.875rem', '2.25rem'], // 30px
        h3: ['1.5rem', '2rem'], // 24px
        textLg: ['1.25rem', '1.75rem'], // 20px
        textBase: ['1rem', '1.5rem'], // 16px
        textSm: ['0.875rem', '1.25rem'], // 14px
      },
    },
  },
  plugins: [],
};

