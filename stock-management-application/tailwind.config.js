/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mybg: "rgb(22,32,42,255)",
        mycolor: "rgba(38,49,60,255)",
        mybtn: "rgb(93, 95, 239)",
      },
    },
  },
  plugins: [],
};
