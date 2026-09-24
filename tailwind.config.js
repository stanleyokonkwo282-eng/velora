/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Brand blue (kept for compatibility across the whole product) */
        royal: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#0B1B4A",
        },
        /* Premium midnight canvas — the product now lives on deep blue */
        midnight: {
          950: "#03071A",
          900: "#050D2A",
          800: "#071238",
          700: "#0A1740",
          600: "#0E1F55",
          500: "#12296B",
          400: "#1B3A9C",
        },
        /* Bright accent ramp for text, icons and data viz on blue */
        azure: {
          50: "#EFF6FF",
          100: "#DCEBFF",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        ink: "#03071A",
        mist: "#C9D7F5",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        serif: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 40px -24px rgba(2,6,20,0.9)",
        lift: "0 28px 70px -30px rgba(2,6,20,0.95), 0 0 0 1px rgba(255,255,255,0.06)",
        glow: "0 0 0 4px rgba(96,165,250,0.22)",
        deep: "0 40px 120px -40px rgba(2,6,20,1)",
        sheen: "0 1px 0 rgba(255,255,255,0.14) inset",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.08  0 0 0 0 0.12  0 0 0 0 0.22  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        aurora:
          "radial-gradient(900px 620px at 12% -8%, rgba(37,99,235,0.50), transparent 62%), radial-gradient(760px 560px at 92% 4%, rgba(96,165,250,0.30), transparent 58%), radial-gradient(900px 820px at 50% 112%, rgba(30,64,175,0.42), transparent 62%)",
        sheen: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3.2s ease-in-out infinite",
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
