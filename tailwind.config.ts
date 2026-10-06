import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT:"#0A1628", light:"#12233F", dark:"#060D1A", border:"#1E3A5F" },
        gold: { DEFAULT:"#C9A227", light:"#E4C45C", dark:"#9C7C1E" },
        brand: { DEFAULT:"#0E3A6E", light:"#1B5BA8" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up":"fadeUp 0.6s ease-out both",
        "fade-in":"fadeIn 0.6s ease-out both",
      },
      keyframes: {
        fadeUp: { "0%":{opacity:"0",transform:"translateY(20px)"},"100%":{opacity:"1",transform:"translateY(0)"} },
        fadeIn: { "0%":{opacity:"0"},"100%":{opacity:"1"} },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
