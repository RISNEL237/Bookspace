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
        bg: "#F5F6F2",
        surface: "#FFFFFF",
        surfaceAlt: "#EFF1EB",
        border: "#E1E4DA",
        borderStrong: "#CBD1C4",
        ink: "#1D2420",
        muted: "#63706A",
        faint: "#98A196",
        primary: { DEFAULT: "#26332C", light: "#3B4B41", pale: "#E7EAE4" },
        accent: { DEFAULT: "#5A7D63", dark: "#456350", pale: "#E3ECE4" },
        info: { DEFAULT: "#5C7DA0", bg: "#E9EFF5" },
        success: { DEFAULT: "#3F8F5F", bg: "#E7F3EC" },
        warning: { DEFAULT: "#B98A2E", bg: "#FAF1DE" },
        danger: { DEFAULT: "#B14E42", bg: "#FAEBE8" },
      },
      fontFamily: {
        head: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: [
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
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
