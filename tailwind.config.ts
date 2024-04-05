import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "/transcript-website/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "/transcript-website/components/**/*.{js,ts,jsx,tsx,mdx}",
    "/transcript-website/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animate")],
};
export default config;
