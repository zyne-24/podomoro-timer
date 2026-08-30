/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f7f4ee",
        surface: "#efe9df",
        forest: "#2f4a3c",
        leaf: "#6b8e5a",
        "leaf-soft": "#aac39a",
        taupe: "#c9a87c",
        brown: "#8a6f4e",
        terracotta: "#c97a5a",
        ink: "#2b2620",
        muted: "#6f6657",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.75rem",
        "2xl": "2.5rem",
        "3xl": "3.5rem",
        display: "7.5rem",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(47, 74, 60, 0.10)",
        card: "0 12px 32px rgba(47, 74, 60, 0.14)",
      },
      maxWidth: {
        container: "1120px",
        card: "400px",
      },
      transitionDuration: {
        progress: "250ms",
      },
    },
  },
  plugins: [],
};
