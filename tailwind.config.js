/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        limelight: ["Limelight", "serif"],
        faculty: ["Faculty Glyphic", "serif"],
      },
    },
  },
  plugins: [],
};
