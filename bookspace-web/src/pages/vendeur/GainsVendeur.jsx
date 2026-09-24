import { CheckCircle2 } from "lucide-react";
import React from "react";
import { versements } from "../../lib/donnees";
import { CarteIndicateur } from "../../components/ui/Composants";

// PAGE : Gains et versements (/vendeur/gains)
export default function GainsVendeur() {
  return (
    <div>
      <div className="section-title mb-5">Gains & versements</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <CarteIndicateur label="Gains nets du mois" value="1 245 €" />
        <CarteIndicateur label="En cours de compensation" value="318 €" />
        <CarteIndicateur label="Prochain versement" value="15 mars" />
      </div>
      <div className="card">
        <div className="card-title">Historique des versements</div>
        {versements.map((p) => (
          <div key={p.label} className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${p.status === "done" ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`}>
              {p.status === "done" ? "" : "⏳"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">{p.label}</div>
              <div className="text-faint text-xs">{p.date} · Virement SEPA</div>
            </div>
            <div className="font-bold">{p.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
