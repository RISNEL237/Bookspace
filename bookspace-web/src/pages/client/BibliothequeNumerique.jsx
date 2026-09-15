import React from "react";
import { bibliothequeNumerique } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Bibliothèque numérique (/compte/bibliotheque)
// Liste des e-books déjà achetés, prêts au téléchargement.
export default function BibliothequeNumerique() {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="section-title">Ma bibliothèque numérique</div>
          <div className="text-muted text-sm mt-1">
            Retrouvez l'ensemble de vos acquisitions numériques prêtes au
            téléchargement et synchronisées.
          </div>
        </div>
        <div className="card !p-3.5 text-right">
          <div className="text-xs text-muted">Espace cloud</div>
          <div className="font-bold text-primary">26.1 Mo / 100 Mo</div>
        </div>
      </div>

      <div className="flex gap-3 my-5">
        <input className="input flex-1" placeholder="Rechercher dans mes livres..." />
        <select className="input w-auto">
          <option>Tous les formats</option>
          <option>ePub</option>
          <option>PDF</option>
        </select>
        <select className="input w-auto">
          <option>Récemment achetés</option>
          <option>Titre A-Z</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4 w-full">
          {bibliothequeNumerique.map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded p-4 flex gap-4">
              <CouvertureLivre cover={b.cover} className="w-14 h-20 shrink-0" tag={b.format} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="pill-muted mb-1.5 inline-block">{b.seller}</span>
                    <div className="font-head font-bold">{b.title}</div>
                    <div className="text-muted text-sm">{b.author}</div>
                  </div>
                  <span className="pill-success">Prêt</span>
                </div>
                <div className="text-faint text-xs mt-1.5 mb-3">
                  Acheté le {b.purchased} · Format {b.format} ({b.size})
                </div>
                <div className="flex gap-2.5">
                  <button className="btn-primary btn-sm">⬇ Télécharger</button>
                  <button className="btn-outline btn-sm">Lire en ligne</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[320px] shrink-0 space-y-5">
          <div className="card">
            <div className="card-title">Vos fichiers sont protégés</div>
            <div className="text-muted text-sm">
              Chaque fichier intègre un tatouage numérique (DRM social) lié à
              votre compte. Téléchargements illimités, licence active et
              perpétuelle.
            </div>
          </div>
          <div className="card">
            <div className="card-title">📲 Compatibilité liseuses</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["Vivlio", "Kobo / Tolino", "Kindle (Send-to)", "Apple Books"].map((l) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className="text-success">✓</span> {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
