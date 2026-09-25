import React from "react";
import { Link } from "react-router-dom";

// Pied de page (footer) affiché en bas de toutes les pages publiques.
// Nouvelle direction : bandeau promo orange au-dessus du footer noir.
export default function PiedDePageClient() {
  return (
    <div className="mt-auto">
      <div className="bg-primary text-white/70 px-6 sm:px-10 py-10 text-[12.5px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="max-w-[240px]">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo-icon.png" alt="BookSpace" className="h-9 w-auto" />
            <span className="font-head text-lg font-bold text-white">
              Book<span className="text-accent">Space</span>
            </span>
          </div>
          <div className="opacity-80">
            La première place de marché du livre papier et numérique, au
            service des librairies indépendantes.
          </div>
        </div>
        <div>
          <h4 className="text-white font-head text-sm font-bold mb-3">Explorer</h4>
          <div className="space-y-2">
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/compte/bibliotheque">Ma bibliothèque</Link>
            <Link to="/compte/commandes">Suivi de commande</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-head text-sm font-bold mb-3">Espace Vendeurs</h4>
          <div className="space-y-2">
            <Link to="/vendeur/inscription">Devenir vendeur partenaire</Link>
            <Link to="/vendeur">Portail vendeur</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-head text-sm font-bold mb-3">Engagements & Légal</h4>
          <div className="space-y-2">
            <Link to="/carnets-critiques">Carnets critiques</Link>
          </div>
        </div>
      </div>
      <div className="bg-primary border-t border-white/10 px-6 sm:px-10 py-4 text-white/50 text-[11px] text-center">
        © {new Date().getFullYear()} BookSpace. Tous droits réservés.
      </div>
    </div>
  );
}
