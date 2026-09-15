import React from "react";
import { adresses } from "../../lib/donnees";

// PAGE : Adresses de livraison (/compte/adresses)
export default function Adresses() {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="section-title">Adresses & relais</div>
        <button className="btn-primary btn-sm">+ Ajouter une adresse</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {adresses.map((a) => (
          <div key={a.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="pill-muted">{a.label}</span>
              {a.isDefault && <span className="pill-success">Par défaut</span>}
            </div>
            <div className="font-bold text-sm mb-1">{a.name}</div>
            <div className="text-muted text-sm leading-relaxed mb-4">
              {a.line}
              <br />
              {a.city}
            </div>
            <div className="flex gap-2.5">
              <button className="btn-outline btn-sm">Modifier</button>
              {!a.isDefault && <button className="btn-ghost btn-sm">Définir par défaut</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
