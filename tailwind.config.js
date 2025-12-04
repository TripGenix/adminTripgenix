/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    containers: {
      card: "inline-size",
      main: "inline-size",
    },
  },
  plugins: [
    require("tailwindcss/container-queries"),
  ],
};
