import React from "react";
import { Link } from "react-router-dom";

// PAGE : 404 - page introuvable (toute URL non reconnue)
export default function PageIntrouvable() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 text-center px-6">
      <div>
        <div className="font-head text-7xl font-bold text-primary mb-3">404</div>
        <div className="section-title mb-2">Cette page semble introuvable</div>
        <div className="text-muted text-sm mb-7">
          Le titre ou la page que vous cherchez a peut-être été déplacé ou
          retiré du catalogue.
        </div>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
