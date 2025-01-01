/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warning: {
          50: "#fffdef",
          100: "#fffad1",
          200: "#fff59e",
          300: "#ffea6c",
          400: "#ffe05a",
          500: "#ffc635",
          600: "#ffa209",
          700: "#e17702",
          800: "#b65b0a",
          900: "#974b0c",
          950: "#562600",
          foreground: "#FFFFFF",
        },
        error: {
          50: "#fff3f3",
          100: "#ffe4e4",
          200: "#ffcccc",
          300: "#ffa8a8",
          400: "#ff6868",
          500: "#ff5959",
          600: "#f03131",
          700: "#e00e0e",
          800: "#ba0f0f",
          900: "#9a1515",
          950: "#540505",
          DEFAULT: "#ff5959",
        },
        success: {
          50: "#eefee7",
          100: "#d7fdca",
          200: "#b2fb9b",
          300: "#83f561",
          400: "#5ae932",
          500: "#39d213",
          600: "#26a60a",
          700: "#1f7e0d",
          800: "#1e6311",
          900: "#1c5413",
          950: "#092f04",
          DEFAULT: "#39d213",
        },
      },
    },
  },
  plugins: [],
};
