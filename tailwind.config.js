const tcolors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  darkMode: "class",
  theme: {
    colors: {
      primary: tcolors.rose,
      secondary: tcolors.blue,
      accent: tcolors.yellow,
    },
    extend: {
      backgroundImage: {
        "welcome-background": "url('/assets/background.webp')",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
