import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xxs: "350px",
        xs: "400px",
      },
    },
  },
  plugins: [],
} satisfies Config;
