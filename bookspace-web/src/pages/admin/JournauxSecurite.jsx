import React from "react";
import { journauxSecurite } from "../../lib/donnees";

// PAGE : Journaux de sécurité (/admin/logs)
// Historique des actions sensibles, à des fins d'audit.
export default function JournauxSecurite() {
  return (
    <div>
      <div className="section-title mb-1">Journaux de sécurité</div>
      <div className="text-muted text-sm mb-6">
        Historique des actions sensibles effectuées sur la plateforme, à des
        fins d'audit et de conformité.
      </div>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>Acteur</th>
              <th>Action</th>
              <th>Date</th>
              <th>Adresse IP</th>
            </tr>
          </thead>
          <tbody>
            {journauxSecurite.map((l, i) => (
              <tr key={i}>
                <td className="font-bold">{l.actor}</td>
                <td>{l.action}</td>
                <td className="text-muted">{l.date}</td>
                <td className="text-faint text-xs">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
