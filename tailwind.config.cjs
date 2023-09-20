/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**.{js,ts,jsx,tsx}",
    "./src/pages/*/**.{js,ts,jsx,tsx}",
    "./src/components/**.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#2c66f2",
          200: "#204dba",
          300: "#183a8c",
          400: "#112961",
          500: "#112961",
          600: "#09193b",
          700: "#061026",
        },
      },
    },
  },
  plugins: [],
};
