export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
		colors: {
		  primary: {
			DEFAULT: "#F4C903", // Dorado vibrante
			foreground: "#1F1F1F", // Contraste sobre dorado
		  },
		  secondary: {
			DEFAULT: "#D9A400", // Dorado más oscuro (hover o borde)
			foreground: "#1F1F1F",
		  },
		  background: "#41071D", // Fondo oscuro principal
		  sidebar: "#41071D",
		  surface: "#F9FAFB", // Fondo claro para tarjetas o áreas secundarias
		  text: {
			DEFAULT: "#FFFFFF", // Texto blanco
			muted: "#E0E0E0",
		  },
		  border: "#D9A400",
		  accent: {
			DEFAULT: "#F4C903",
			foreground: "#1F1F1F",
		  },
		  muted: {
			DEFAULT: "#f3f4f6",
			foreground: "#6b7280",
		  },
		  destructive: {
			DEFAULT: "#DC2626",
			foreground: "#fff",
		  },
		  card: {
			DEFAULT: "#FFFFFF",
			foreground: "#1F2937",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
	  },
  },
  plugins: [require("tailwindcss-animate")],
};
