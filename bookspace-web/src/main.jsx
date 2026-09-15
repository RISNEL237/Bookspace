import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Application from "./Application.jsx";
import "./index.css";

// Point d'entrée : on affiche le composant "Application" (le routeur)
// à l'intérieur de la balise <div id="root"></div> du fichier index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </React.StrictMode>
);
