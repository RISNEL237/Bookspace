import { AlertTriangle } from "lucide-react";
import React from "react";
import { vendeursEnAttente } from "../../lib/donnees";
import { CarteIndicateur } from "../../components/ui/Composants";

// PAGE : Supervision globale (/admin)
// Indicateurs clés de toute la marketplace.
export default function TableauDeBordAdmin() {
  return (
    <div>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
        <div>
          <div className="section-title">Supervision globale de la plateforme</div>
          <div className="text-muted text-sm mt-1">
            Vue consolidée des ventes, vendeurs et conformité — tous marchés
            confondus
          </div>
        </div>
        <button className="btn-outline btn-sm">↻ Actualiser les données</button>
      </div>

      <div className="bg-warning-bg border border-[#ecd9ad] rounded p-3.5 flex items-center gap-3 mb-5 text-[12.5px]">
        <div className="w-9 h-9 rounded-[10px] bg-warning-bg text-warning flex items-center justify-center"></div>
        <div>
          <b>2 signalements critiques</b> nécessitent un arbitrage sous 24h —
          voir Modération & signalements.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <CarteIndicateur label="Volume brut (GMV)" value="124 850 €" delta="↑18,4%" foot="vs mois précédent" />
        <CarteIndicateur label="Vendeurs actifs" value="86" foot="Librairies & éditeurs" />
        <CarteIndicateur label="Signalements actifs" value="2" foot="Sous enquête prioritaire" />
        <CarteIndicateur label="Commissions nettes" value="15 420 €" foot="Taux moyen 12,35%" />
      </div>

      <div className="flex flex-col md:flex-row gap-5 mt-5.5">
        <div className="flex-[1.4] card">
          <div className="card-title">Répartition du volume par catégorie</div>
          <div className="flex items-center gap-5 mt-2.5">
            <div
              className="w-[150px] h-[150px] rounded-full shrink-0"
              style={{
                background:
                  "conic-gradient(#26332C 0 45%, #5A7D63 45% 75%, #5C7DA0 75% 92%, #B98A2E 92% 100%)",
              }}
            />
            <div className="flex-1 text-sm">
              {[
                ["#26332C", "Livres papier — librairies", "45%"],
                ["#5A7D63", "E-livres & PDF", "30%"],
                ["#5C7DA0", "Éditions limitées / rares", "17%"],
                ["#B98A2E", "Abonnements Box", "8%"],
              ].map(([c, l, v]) => (
                <div key={l} className="flex justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} /> {l}
                  </span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 card">
          <div className="card-title">Top marchés</div>
          {[
            ["FR", "France", "62 vendeurs actifs", "78 400 €"],
            ["BE", "Belgique", "14 vendeurs actifs", "21 200 €"],
            ["CH", "Suisse", "10 vendeurs actifs", "18 900 €"],
          ].map(([flag, name, sub, amt]) => (
            <div key={name} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
              <div className="w-[26px] h-[18px] rounded-[3px] bg-surfaceAlt flex items-center justify-center text-[10px] font-bold text-muted">
                {flag}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{name}</div>
                <div className="text-faint text-xs">{sub}</div>
              </div>
              <div className="font-bold text-sm">{amt}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-5.5">
        <div className="flex justify-between items-center mb-3.5">
          <div className="card-title mb-0">Demandes d'activation vendeurs en attente</div>
          <span className="pill-warning">{vendeursEnAttente.length} dossiers</span>
        </div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Nom commercial</th>
              <th>Type de structure</th>
              <th>Pays</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendeursEnAttente.slice(0, 2).map((s) => (
              <tr key={s.name}>
                <td className="font-bold">{s.name}</td>
                <td>{s.type}</td>
                <td>{s.country}</td>
                <td><span className="pill-warning">En attente</span></td>
                <td className="flex gap-2">
                  <button className="btn-success-outline btn-sm">Valider</button>
                  <button className="btn-danger-outline btn-sm">Rejeter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
