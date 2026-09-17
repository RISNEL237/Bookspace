import { Book, Save } from "lucide-react";
import React from "react";

// PAGE : Commissions et règles de la marketplace (/admin/commissions)
const history = [
  ["Il y a 4 jours", "Commission livres numériques", "18,0 %", "20,0 %", "Super-Admin #001"],
  ["12 févr. 2025", "Palier dégressif librairies", "Désactivé", "Activé", "Super-Admin #002"],
  ["03 janv. 2025", "Commission livres physiques", "12,0 %", "10,0 %", "Super-Admin #001"],
];

export default function Commissions() {
  return (
    <div>
      <div className="section-title mb-1">Commissions & règles de la marketplace</div>
      <div className="text-muted text-sm mb-6">
        Taux appliqués en temps réel sur le moteur de répartition automatique
        des paiements.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card">
          <div className="card-title"><Book />Commission — Livres physiques</div>
          <div className="card-sub">Prélevée sur le montant HT versé au vendeur, hors frais d'expédition</div>
          <div className="font-head text-[34px] font-bold text-primary">10,0 %</div>
          <div className="h-2 rounded-full bg-surfaceAlt relative my-4">
            <div className="absolute left-0 h-full bg-primary rounded-full" style={{ width: "33%" }} />
          </div>
          <div className="flex justify-between text-xs text-faint">
            <span>0%</span>
            <span>30% max</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title"><Save /> Commission — Livres numériques</div>
          <div className="card-sub">Inclut le coût de distribution CDN et le tatouage DRM</div>
          <div className="font-head text-[34px] font-bold text-primary">20,0 %</div>
          <div className="h-2 rounded-full bg-surfaceAlt relative my-4">
            <div className="absolute left-0 h-full bg-primary rounded-full" style={{ width: "55%" }} />
          </div>
          <div className="flex justify-between text-xs text-faint">
            <span>0%</span>
            <span>40% max</span>
          </div>
        </div>
      </div>

      <div className="card mt-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="card-title mb-0.5">Palier dégressif librairies labellisées</div>
            <div className="text-muted text-sm">
              Réduction automatique de 2,5% dès qu'un vendeur maintient un
              taux d'expédition sous 24h supérieur à 98%.
            </div>
          </div>
          <div className="w-[40px] h-[22px] rounded-full bg-accent relative shrink-0">
            <div className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="card mt-5">
        <div className="card-title">Historique des ajustements</div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Date</th>
              <th>Règle modifiée</th>
              <th>Ancienne valeur</th>
              <th>Nouvelle valeur</th>
              <th>Modifié par</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 3 ? "font-bold" : ""}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-5.5">
        <div className="text-muted text-sm">
          Contrat d'entiercement (escrow) : <b className="text-ink">0x71F…9B28</b>
        </div>
        <button className="btn-primary">Enregistrer les règles de commission</button>
      </div>
    </div>
  );
}
