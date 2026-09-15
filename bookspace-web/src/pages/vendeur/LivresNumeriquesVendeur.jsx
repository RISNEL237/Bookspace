import React from "react";
import { Link } from "react-router-dom";
import { livresNumeriquesVendeur } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Catalogue numérique du vendeur (/vendeur/livres-numeriques)
export default function LivresNumeriquesVendeur() {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="section-title">Mes livres numériques</div>
          <div className="text-muted text-sm mt-1">Fichiers distribués, tatouage DRM et téléchargements.</div>
        </div>
        <Link to="/vendeur/livres/nouveau" className="btn-primary">+ Ajouter un ouvrage</Link>
      </div>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>Ouvrage</th>
              <th>Format</th>
              <th>Prix</th>
              <th>Téléchargements</th>
              <th>Protection</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {livresNumeriquesVendeur.map((b) => (
              <tr key={b.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <CouvertureLivre cover={b.cover} className="w-8 h-11 shrink-0" />
                    <div>
                      <div className="font-bold">{b.title}</div>
                      <div className="text-faint text-xs">{b.author}</div>
                    </div>
                  </div>
                </td>
                <td>{b.format}</td>
                <td className="font-bold">{b.priceEbook.toFixed(2)} €</td>
                <td>{b.downloads}</td>
                <td>
                  <span className="pill-info">DRM social actif</span>
                </td>
                <td>
                  <button className="btn-outline btn-sm">Gérer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
