import React from "react";

// Pied de page (footer) affiché en bas de toutes les pages publiques.
export default function PiedDePageClient() {
  return (
    <div className="bg-primary text-white/70 px-10 py-10 text-[12.5px] flex flex-col md:flex-row justify-between gap-8 mt-auto">
      <div className="max-w-[240px]">
        <h4 className="text-white font-head text-base mb-3">BookSpace</h4>
        <div className="opacity-80">
          La place de marché du livre papier et numérique, au service des
          librairies indépendantes.
        </div>
      </div>
      <div>
        <h4 className="text-white font-head text-base mb-3">Espace acheteurs</h4>
        <div className="space-y-2">
          <div>Ma bibliothèque</div>
          <div>Suivi de commande</div>
          <div>Cartes cadeaux</div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-head text-base mb-3">Vendeurs</h4>
        <div className="space-y-2">
          <div>Vendre sur BookSpace</div>
          <div>Portail libraire</div>
          <div>Éditeurs</div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-head text-base mb-3">Sécurité</h4>
        <div className="space-y-2">
          <div>Prix unique du livre</div>
          <div>Paiement sécurisé</div>
          <div>Mentions légales</div>
        </div>
      </div>
    </div>
  );
}
