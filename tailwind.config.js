/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
};

export default config;
