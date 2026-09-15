import React from "react";
import { Link } from "react-router-dom";
import { livresPhysiquesVendeur } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Catalogue papier du vendeur (/vendeur/livres-physiques)
export default function LivresPhysiquesVendeur() {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="section-title">Mes livres physiques</div>
          <div className="text-muted text-sm mt-1">Gestion des stocks et prix de vos ouvrages papier.</div>
        </div>
        <Link to="/vendeur/livres/nouveau" className="btn-primary">+ Ajouter un ouvrage</Link>
      </div>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>Ouvrage</th>
              <th>ISBN</th>
              <th>Stock</th>
              <th>Prix</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {livresPhysiquesVendeur.map((b) => (
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
                <td className="text-faint text-xs">{b.isbn}</td>
                <td>{b.stock} ex.</td>
                <td className="font-bold">{b.pricePaper.toFixed(2)} €</td>
                <td>
                  <span className={b.stock > 5 ? "pill-success" : "pill-warning"}>
                    {b.stock > 5 ? "En stock" : "Stock faible"}
                  </span>
                </td>
                <td>
                  <button className="btn-outline btn-sm">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
