import React from "react";
import { Link } from "react-router-dom";

// Pied de page (footer) affiché en bas de toutes les pages publiques.
// Nouvelle direction : bandeau promo orange au-dessus du footer noir.
export default function PiedDePageClient() {
  return (
    <div className="mt-auto">
      {/* Bandeau promo */}
      <div className="bg-accent text-white px-6 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="font-head text-xl sm:text-2xl font-extrabold">50% Sale !</div>
          <div className="text-sm sm:text-base opacity-90">
            Profitez de jusqu'à 50% de réduction sur une sélection chaque semaine
          </div>
        </div>
        <Link to="/catalogue" className="btn bg-white text-accent hover:bg-white/90 shrink-0">
          En profiter →
        </Link>
      </div>

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
            <div>Nouveautés</div>
            <div>Ma bibliothèque</div>
            <div>Suivi de commande</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-head text-sm font-bold mb-3">Espace Vendeurs</h4>
          <div className="space-y-2">
            <div>Devenir libraire partenaire</div>
            <div>Portail vendeur</div>
            <div>Charte qualité du réseau</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-head text-sm font-bold mb-3">Engagements & Légal</h4>
          <div className="space-y-2">
            <div>Respect du Prix Unique (Loi Lang)</div>
            <div>Paiement Sécurisé DSP2</div>
            <div>Mentions légales</div>
          </div>
        </div>
      </div>
      <div className="bg-primary border-t border-white/10 px-6 sm:px-10 py-4 text-white/50 text-[11px] text-center">
        © 2025 BookSpace SAS. Tous droits réservés.
      </div>
    </div>
  );
}
