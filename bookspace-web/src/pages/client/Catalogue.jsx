import React, { useState } from "react";
import { livres } from "../../lib/donnees";
import { CarteLivreResultat } from "../../components/livres/CartesLivres";
import { FilAriane } from "../../components/ui/Composants";

// PAGE : Catalogue (/catalogue)
// Liste des livres avec filtres (format, prix, vendeur, langue).
const FilterCheck = ({ checked, label, count }) => (
  <div className="flex items-center justify-between text-sm text-muted py-1.5">
    <div className="flex items-center gap-2.5">
      <div className={`w-3.5 h-3.5 rounded-[4px] border-[1.5px] ${checked ? "bg-accent border-accent" : "border-borderStrong"}`} />
      {label}
    </div>
    <span className="text-faint">{count}</span>
  </div>
);

export default function Catalogue() {
  const [recherche] = useState("roman historique");

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: `Résultats pour « ${recherche} »` }]} />
      <div className="flex gap-7 px-10 pt-6 pb-10">
        <div className="w-[250px] shrink-0">
          <div className="card">
            <div className="mb-6">
              <h5 className="text-[11.5px] uppercase tracking-wide text-faint font-bold mb-3">Format</h5>
              <FilterCheck checked label="Livre broché" count={312} />
              <FilterCheck label="Livre relié" count={84} />
              <FilterCheck checked label="E-pub" count={198} />
              <FilterCheck label="PDF" count={61} />
            </div>
            <div className="mb-6">
              <h5 className="text-[11.5px] uppercase tracking-wide text-faint font-bold mb-3">Prix</h5>
              <div className="h-[5px] rounded-full bg-surfaceAlt relative my-3.5">
                <div className="absolute left-[15%] right-[35%] h-full bg-accent rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>5 €</span>
                <span>45 €</span>
              </div>
            </div>
            <div className="mb-6">
              <h5 className="text-[11.5px] uppercase tracking-wide text-faint font-bold mb-3">Vendeur</h5>
              <FilterCheck checked label="Librairies indépendantes" count={276} />
              <FilterCheck label="Éditeurs directs" count={119} />
            </div>
            <button className="btn-outline btn-sm w-full">Réinitialiser les filtres</button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-2 flex-wrap mb-4">
            {["Roman historique", "Livre broché", "E-pub", "Français"].map((c) => (
              <div key={c} className="bg-surface border border-borderStrong rounded-full px-3.5 py-1.5 text-xs text-muted">
                {c} ✕
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-5">
            <div className="text-muted text-sm">
              <b className="text-primary">{livres.length * 76}</b> résultats trouvés
            </div>
            <div className="pill-muted">Trier par : Pertinence ▾</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...livres, ...livres].map((b, i) => (
              <CarteLivreResultat key={i} book={b} />
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, "…", 24].map((p, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-bold border ${p === 1 ? "bg-primary text-white border-primary" : "text-muted border-border"}`}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
