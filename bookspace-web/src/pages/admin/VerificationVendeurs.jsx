import React, { useEffect, useState } from "react";
import { fetchAdminSellers, updateSellerStatus } from "../../lib/api";

// PAGE : Vérification des vendeurs - KYB (/admin/verification)
export default function VerificationVendeurs() {
  const [vendeurs, definirVendeurs] = useState([]);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    fetchAdminSellers()
      .then(definirVendeurs)
      .catch((error) => definirErreur(error.message));
  }, []);

  async function changerStatut(id, statut) {
    try {
      const vendeur = await updateSellerStatus(id, statut);
      definirVendeurs((actuels) => actuels.map((item) => item.id === vendeur.id ? vendeur : item));
    } catch (error) {
      definirErreur(error.message);
    }
  }

  return (
    <div>
      <div className="section-title mb-1">Vérification des vendeurs (KYB)</div>
      <div className="text-muted text-sm mb-5">
        Contrôle d'identité corporative et conformité avant déblocage des
        flux de paiement.
      </div>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nom commercial</th>
              <th>Structure</th>
              <th>Pays</th>
              <th>Documents fournis</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendeurs.map((s) => (
              <tr key={s.name}>
                <td>
                  <div className="font-bold">{s.shop_name}</div>
                  <div className="text-faint text-xs">{s.siret}</div>
                </td>
                <td>{s.legal_type}</td>
                <td>{s.country}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {(s.documents || []).map((d) => (
                      <span
                        key={d}
                        className={`text-[10.5px] font-bold px-2 py-1 rounded-[6px] ${d.includes("attente") ? "bg-warning-bg text-warning" : "bg-success-bg text-success"}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
                <td><span className={s.kyb_status === "approved" ? "pill-success" : s.kyb_status === "rejected" ? "pill-danger" : "pill-warning"}>{s.kyb_status}</span></td>
                <td className="flex gap-2">
                  <button onClick={() => changerStatut(s.id, "approved")} className="btn-success-outline btn-sm">Valider</button>
                  <button onClick={() => changerStatut(s.id, "rejected")} className="btn-danger-outline btn-sm">Rejeter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between text-sm text-muted mt-3.5">
          <span>
            {erreur ? <b className="text-danger">{erreur}</b> : <>Vendeurs chargés : <b className="text-ink">{vendeurs.length}</b></>}
          </span>
          <span>Conformité DAC7 & DSP2 · Transmission fiscale automatique</span>
        </div>
      </div>
    </div>
  );
}
