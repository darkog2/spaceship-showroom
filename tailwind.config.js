/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-navy": "#04030A",
        "navy-charcoal": "#0D0917",
        "panel-dark": "#171127",
        "text-light": "#F6F3FF",
        "cyan-holo": "#A97DFF",
        "amber-ui": "#FF8F1F",
        "magenta-neon": "#CE6BFF",
        "ember-core": "#FF5B17"
      },
      fontFamily: {
        oxanium: ["Oxanium", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
        sora: ["Rajdhani", "sans-serif"],
        inter: ["Exo 2", "sans-serif"],
        jetbrains: ["Share Tech Mono", "monospace"]
      },
      boxShadow: {
        glow: "0 0 28px rgba(255, 143, 31, 0.35)",
        "glow-sm": "0 0 16px rgba(255, 143, 31, 0.25)",
        holo: "0 0 40px rgba(169, 125, 255, 0.35)"
      }
    }
  },
  plugins: []
};
