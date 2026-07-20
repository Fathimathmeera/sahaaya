import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { brand: { 50: "#eff8ff", 500: "#1976d2", 700: "#0d47a1" }, accent: { 500: "#138a5b", 700: "#076b43" } }, boxShadow: { card: "0 8px 24px rgb(15 23 42 / 0.08)" } } }, plugins: [] };
export default config;
