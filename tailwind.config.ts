import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d4a6b",
        "primary-dark": "#1a5276",
        secondary: "#e67e22",
        "header-green": "#1e8449",
      },
    },
  },
  plugins: [],
};

export default config;
