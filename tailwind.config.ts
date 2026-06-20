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
        "page-bg": "#F3F6FC",
        "sidebar-bg": "#EEF4FF",
        "primary-blue": "#005BEA",
        "light-blue": "#C7DBF7",
        "light-blue-bg": "#DCEBFF",
        "text-main": "#0F172A",
        "text-secondary": "#64748B",
        "text-muted": "#94A3B8",
        "border-color": "#E2E8F0",
        "status-green": "#16A34A",
        "status-green-bg": "#F0FDF4",
        "status-yellow": "#D97706",
        "status-yellow-bg": "#FEFCE8",
        "status-red": "#DC2626",
        "status-red-bg": "#FEF2F2",
        "status-blue": "#2563EB",
        "status-blue-bg": "#EFF6FF",
      },
    },
  },
  plugins: [],
};
export default config;
