/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-gray-bg": "#F8F9FA",
        "custom-gray-dark": "#2D3748",
        "custom-gray-light": "#A0AEC0",
        "custom-blue-light": "#4FD1C5",
        "custom-gray-content": "#718096",
        "custom-green-calendar": "#75CEC5",
      },
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
