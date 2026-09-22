// ============================================================
// Configuration de Tailwind CSS
// ============================================================
// Tailwind fonctionne avec des "classes utilitaires" directement
// dans le JSX (ex: className="bg-primary text-white p-4").
// Ce fichier sert à déclarer les couleurs, polices et arrondis
// PERSONNALISÉS du projet BookSpace, pour pouvoir écrire
// className="bg-primary" au lieu d'une couleur hexadécimale.
//
// "content" indique à Tailwind où chercher les classes utilisées,
// afin de ne générer QUE le CSS réellement nécessaire (fichier léger).
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F6",
        surface: "#FFFFFF",
        surfaceAlt: "#F5F1EC",
        border: "#ECE4DC",
        borderStrong: "#DCD0C4",
        ink: "#1A1613",
        muted: "#6B6158",
        faint: "#9C9187",
        primary: { DEFAULT: "#1A1613", light: "#332B25", pale: "#EFEAE5" },
        accent: { DEFAULT: "#E8632B", dark: "#C94F1F", pale: "#FDE9DD" },
        info: { DEFAULT: "#3B6FA6", bg: "#E8F0F8" },
        success: { DEFAULT: "#2F9E5C", bg: "#E7F6ED" },
        warning: { DEFAULT: "#C98A2E", bg: "#FBF1DE" },
        danger: { DEFAULT: "#C23B2E", bg: "#FBEAE7" },
      },
      fontFamily: {
        head: ["Poppins", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        body: ["Inter", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,28,22,0.06)",
        pop: "0 2px 10px rgba(20,28,22,0.07)",
      },
    },
  },
  plugins: [],
};
