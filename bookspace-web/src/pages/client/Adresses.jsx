import React, { useEffect, useState } from "react";
import { fetchAddresses } from "../../lib/api";

// PAGE : Adresses de livraison (/compte/adresses)
export default function Adresses() {
  const [adresses, definirAdresses] = useState([]);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    fetchAddresses()
      .then(definirAdresses)
      .catch((error) => definirErreur(error.message));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="section-title">Adresses & relais</div>
        <button className="btn-primary btn-sm">+ Ajouter une adresse</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {erreur && <div className="text-danger text-sm">{erreur}</div>}
        {!erreur && adresses.length === 0 && <div className="text-muted text-sm">Aucune adresse enregistrée.</div>}
        {adresses.map((a) => (
          <div key={a.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="pill-muted">{a.libelle}</span>
              {a.is_default && <span className="pill-success">Par défaut</span>}
            </div>
            <div className="font-bold text-sm mb-1">{a.nom_destinataire}</div>
            <div className="text-muted text-sm leading-relaxed mb-4">
              {a.adresse?.line || a.adresse?.street || "Adresse"}
              <br />
              {a.adresse?.city || a.adresse?.postal_code || ""}
            </div>
            <div className="flex gap-2.5">
              <button className="btn-outline btn-sm">Modifier</button>
              {!a.is_default && <button className="btn-ghost btn-sm">Définir par défaut</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
