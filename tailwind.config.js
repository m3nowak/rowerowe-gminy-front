import { yellow } from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"];
export const darkMode = "class";
export const theme = {
  colors: {
    primary: {
      50: "#fef2f2",
      100: "#ffe1e1",
      200: "#ffc9c9",
      300: "#fea3a3",
      400: "#fb6e6e",
      500: "#f24141",
      600: "#e02525",
      700: "#bc1919",
      800: "#9c1818",
      900: "#811b1b",
      950: "#460909",
    },

    accent: yellow,
    strava: "#FC4C02",
  },
  extend: {
    backgroundImage: {
      "welcome-background": "url('/assets/background.webp')",
    },
  },
};
export const plugins = [require("flowbite/plugin")];
