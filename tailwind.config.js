/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      'backgroundImage': {
        'welcome-background': "url('/assets/background.webp')",
      }
    },
  },
  plugins: [],
}

