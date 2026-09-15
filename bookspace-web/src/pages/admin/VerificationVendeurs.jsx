import React from "react";
import { vendeursEnAttente } from "../../lib/donnees";

// PAGE : Vérification des vendeurs - KYB (/admin/verification)
export default function VerificationVendeurs() {
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
            {vendeursEnAttente.map((s) => (
              <tr key={s.name}>
                <td>
                  <div className="font-bold">{s.name}</div>
                  <div className="text-faint text-xs">{s.siret}</div>
                </td>
                <td>{s.type}</td>
                <td>{s.country}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {s.docs.map((d) => (
                      <span
                        key={d}
                        className={`text-[10.5px] font-bold px-2 py-1 rounded-[6px] ${d.includes("attente") ? "bg-warning-bg text-warning" : "bg-success-bg text-success"}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
                <td><span className="pill-warning">En attente</span></td>
                <td className="flex gap-2">
                  <button className="btn-success-outline btn-sm">Valider</button>
                  <button className="btn-danger-outline btn-sm">Rejeter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between text-sm text-muted mt-3.5">
          <span>
            Taux d'approbation mensuel : <b className="text-ink">94,2%</b>
          </span>
          <span>Conformité DAC7 & DSP2 · Transmission fiscale automatique</span>
        </div>
      </div>
    </div>
  );
}
