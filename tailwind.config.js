/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'display': ['Bebas Neue', 'cursive'],
        'primary': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
