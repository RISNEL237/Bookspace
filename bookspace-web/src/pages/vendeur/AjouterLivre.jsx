import { Info, Lock } from "lucide-react";
import React, { useState } from "react";

// PAGE : Ajouter un ouvrage (/vendeur/livres/nouveau)
// Formulaire permettant de configurer un livre en papier et/ou numérique.
export default function AjouterLivre() {
  const [papier, definirPapier] = useState(true);
  const [numerique, definirNumerique] = useState(true);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="section-title">Ajouter un ouvrage au catalogue</div>
          <div className="text-muted text-sm mt-1">
            Renseignez les métadonnées puis configurez l'offre physique
            et/ou numérique.
          </div>
        </div>
        <span className="pill-info">Mode hybride · Physique & numérique</span>
      </div>

      <div className="card mb-5">
        <div className="flex items-center gap-2.5 mb-4.5">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
          <div className="card-title mb-0">Métadonnées bibliographiques</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label>Titre de l'ouvrage</label>
            <input className="input" placeholder="Les Mémoires de l'Ombre" />
          </div>
          <div className="field">
            <label>Auteur(s)</label>
            <input className="input" placeholder="Madeleine de Varenne" />
          </div>
          <div className="field">
            <label>ISBN / EAN13</label>
            <input className="input" placeholder="978-2-07-012345-6" />
          </div>
          <div className="field">
            <label>Catégorie littéraire</label>
            <input className="input" placeholder="Littérature contemporaine" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-4.5">
        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
        <div className="card-title mb-0">Configuration des formats disponibles à la vente</div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className={`flex-1 border-[1.5px] rounded p-5 ${papier ? "border-accent bg-accent-pale" : "border-border"}`}>
          <label className="flex items-center gap-2.5 text-sm font-bold mb-4">
            <input type="checkbox" checked={papier} onChange={(e) => definirPapier(e.target.checked)} />
            Format physique (papier)
            <span className="pill-accent ml-auto">Stock librairie</span>
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="field">
              <label>Quantité en stock</label>
              <input className="input" placeholder="15 ex." />
            </div>
            <div className="field">
              <label>Prix TTC (Loi Lang)</label>
              <input className="input" placeholder="19,99 €" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" defaultChecked />
            Disponible en retrait Click & Collect
          </label>
        </div>

        <div className={`flex-1 border-[1.5px] rounded p-5 ${numerique ? "border-accent bg-accent-pale" : "border-border"}`}>
          <label className="flex items-center gap-2.5 text-sm font-bold mb-4">
            <input type="checkbox" checked={numerique} onChange={(e) => definirNumerique(e.target.checked)} />
            Format numérique (ePub / PDF)
            <span className="pill-info ml-auto">Distribution directe</span>
          </label>
          <div className="grid grid-cols-2 gap-3.5 mb-4">
            <div className="field">
              <label>Prix de vente e-book</label>
              <input className="input" placeholder="9,99 €" />
            </div>
            <div className="field">
              <label>Protection</label>
              <input className="input" defaultValue="Tatouage numérique (DRM social)" />
            </div>
          </div>
          <div className="border-2 border-dashed border-borderStrong rounded bg-surfaceAlt p-5 text-center">
            <div className="text-2xl mb-1.5">{<Lock size={12} className="text-current" />}</div>
            <div className="text-sm font-bold">Téléverser le fichier source (.epub, .pdf)</div>
            <div className="text-faint text-xs mt-1">Glissez votre fichier ici — 50 Mo max</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 items-start sm:items-center">
        <div className="text-muted text-sm">
          {<Info size={12} className="text-blue-500" />}Indexation immédiate sur la place de marché dès validation de
          l'ISBN.
        </div>
        <div className="flex gap-3">
          <button className="btn-outline">Enregistrer comme brouillon</button>
          <button className="btn-primary">Publier l'ouvrage sur BookSpace</button>
        </div>
      </div>
    </div>
  );
}
