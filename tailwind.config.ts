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
        navy: { DEFAULT:"#0F1823", light:"#1C2733", dark:"#0A111A", border:"#2A3744" },
        gold: { DEFAULT:"#8597B4", light:"#AEBCD2", dark:"#667892" },
        brand: { DEFAULT:"#30465F", light:"#44617F" },
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
        "grid-pattern": "linear-gradient(rgba(133,151,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(133,151,180,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
