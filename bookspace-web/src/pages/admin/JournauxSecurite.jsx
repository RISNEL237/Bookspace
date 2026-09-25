import React from "react";

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
      <div className="card text-muted text-sm">Aucun journal d'audit n'est encore configuré sur le serveur.</div>
    </div>
  );
}
