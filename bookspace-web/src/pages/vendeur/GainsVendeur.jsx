import { CheckCircle2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { fetchSellerPayouts } from "../../lib/api";
import { CarteIndicateur } from "../../components/ui/Composants";

// PAGE : Gains et versements (/vendeur/gains)
export default function GainsVendeur() {
  const [versements, definirVersements] = useState([]);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    fetchSellerPayouts()
      .then(definirVersements)
      .catch((error) => definirErreur(error.message));
  }, []);

  const totalNet = useMemo(
    () => versements.reduce((total, versement) => total + Number(versement.net_amount || 0), 0),
    [versements]
  );
  const totalEnAttente = useMemo(
    () => versements.filter((versement) => versement.status === "pending" || versement.status === "processing")
      .reduce((total, versement) => total + Number(versement.net_amount || 0), 0),
    [versements]
  );

  return (
    <div>
      <div className="section-title mb-5">Gains & versements</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <CarteIndicateur label="Gains nets cumulés" value={`${totalNet.toFixed(2)} €`} />
        <CarteIndicateur label="En cours de compensation" value={`${totalEnAttente.toFixed(2)} €`} />
        <CarteIndicateur label="Versements enregistrés" value={String(versements.length)} />
      </div>
      <div className="card">
        <div className="card-title">Historique des versements</div>
        {erreur && <div className="text-danger text-sm mb-3">{erreur}</div>}
        {!erreur && versements.length === 0 && <div className="text-muted text-sm">Aucun versement enregistré.</div>}
        {versements.map((p) => (
          <div key={p.id} className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${p.status === "paid" ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`}>
              <CheckCircle2 size={16} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Versement {p.status}</div>
              <div className="text-faint text-xs">{p.paid_at || p.scheduled_at || "Date non planifiée"} · {p.provider}</div>
            </div>
            <div className="font-bold">{Number(p.net_amount || 0).toFixed(2)} {p.currency || "EUR"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
