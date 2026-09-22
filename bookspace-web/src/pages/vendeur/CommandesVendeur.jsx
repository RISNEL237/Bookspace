import Icone from "../../components/ui/Icone";
import React, { useState } from "react";
import { commandesVendeur } from "../../lib/donnees";

// PAGE : Commandes à expédier (/vendeur/commandes)
const tabs = ["Toutes (4)", "Colissimo (3)", "Click & Collect (1)"];

export default function CommandesVendeur() {
  const [onglet, definirOnglet] = useState(0);
  return (
    <div>
      <div className="section-title mb-5">Commandes à expédier</div>
      <div className="card">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="card-title mb-0"><span className="inline-flex items-center gap-2"><Icone name="Truck" size={17} /> Commandes physiques à traiter</span></div>
          <div className="flex gap-2.5">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => definirOnglet(i)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-bold border ${i === onglet ? "bg-primary text-white border-primary" : "text-muted border-borderStrong"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Titre</th>
              <th>Livraison</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {commandesVendeur.map((o) => (
              <tr key={o.id}>
                <td className="font-bold">#{o.id}</td>
                <td>{o.client}</td>
                <td>{o.title}</td>
                <td>{o.shipping}</td>
                <td><span className={`pill-${o.tone}`}>{o.status}</span></td>
                <td><button className="btn-outline btn-sm">Traiter</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
