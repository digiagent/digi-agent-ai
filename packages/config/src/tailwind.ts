import type { Config } from "tailwindcss";

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a5f",
        },
      },
    },
  },
};
