// Configuration de Vite : l'outil qui fait tourner le serveur de
// développement (npm run dev) et qui prépare le site pour la mise
// en ligne (npm run build). Le plugin "react" lui apprend à
// comprendre les fichiers .jsx.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
