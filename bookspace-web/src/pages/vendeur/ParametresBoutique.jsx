import React from "react";

// PAGE : Paramètres de la boutique (/vendeur/parametres)
export default function ParametresBoutique() {
  return (
    <div>
      <div className="section-title mb-6">Paramètres boutique</div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-5 w-full">
          <div className="card">
            <div className="card-title">Informations de la boutique</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label>Nom commercial</label>
                <input className="input" defaultValue="Librairie Delamain" />
              </div>
              <div className="field">
                <label>Ville</label>
                <input className="input" defaultValue="Paris 1er" />
              </div>
              <div className="field sm:col-span-2">
                <label>Description publique</label>
                <input className="input" defaultValue="Librairie indépendante fondée en 1700, spécialisée en littérature classique et contemporaine." />
              </div>
            </div>
            <button className="btn-primary btn-sm">Enregistrer</button>
          </div>

          <div className="card">
            <div className="card-title">Options de livraison</div>
            {["Colissimo recommandé", "Click & Collect en boutique", "Livraison express 24h"].map((o) => (
              <label key={o} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-b-0">
                {o}
                <input type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[320px] shrink-0 space-y-5">
          <div className="card">
            <div className="card-title">💳 Compte de paiement</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Stripe Connect</span>
              <span className="pill-success">Vérifié</span>
            </div>
            <div className="text-faint text-xs">IBAN se terminant par •• 4417</div>
          </div>
          <div className="card">
            <div className="card-title">Équipe</div>
            <div className="text-sm text-muted mb-3">2 membres ont accès à ce compte</div>
            <button className="btn-outline btn-sm w-full">Gérer les accès</button>
          </div>
        </div>
      </div>
    </div>
  );
}
