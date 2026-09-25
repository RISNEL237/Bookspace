import React, { useEffect, useState } from "react";
import { fetchAdminReports, updateAdminReport } from "../../lib/api";

export default function Moderation() {
  const [signalements, setSignalements] = useState([]);
  const [erreur, setErreur] = useState("");
  useEffect(() => { fetchAdminReports().then(setSignalements).catch((error) => setErreur(error.message)); }, []);

  async function traiter(signalement, masquer) {
    setErreur("");
    try {
      await updateAdminReport(signalement.id, { status: masquer ? "action_prise" : "classe_sans_suite", mask_offer: masquer });
      setSignalements((current) => current.map((item) => item.id === signalement.id ? { ...item, status: masquer ? "action_prise" : "classe_sans_suite" } : item));
    } catch (error) { setErreur(error.message); }
  }

  const enAttente = signalements.filter((item) => ["en_attente", "en_cours"].includes(item.status));
  return <div><div className="flex justify-between items-center mb-5"><div className="section-title">Signalements d'abus et de contrefaçon</div><span className="pill-danger">{enAttente.length} en attente</span></div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="card overflow-x-auto"><table className="table-base"><thead><tr><th>Date</th><th>Offre signalée</th><th>Motif</th><th>Description</th><th>Statut</th><th>Arbitrage</th></tr></thead><tbody>
      {signalements.map((report) => <tr key={report.id}><td>{new Date(report.created_at).toLocaleDateString("fr-FR")}</td><td className="font-bold">{report.title}</td><td>{report.reason}</td><td>{report.description || "—"}</td><td>{report.status}</td><td className="flex gap-2"><button type="button" onClick={() => traiter(report, true)} className="btn-danger-outline btn-sm">Masquer l'offre</button><button type="button" onClick={() => traiter(report, false)} className="btn-outline btn-sm">Classer</button></td></tr>)}
    </tbody></table>{!erreur && signalements.length === 0 && <div className="text-muted text-sm p-3">Aucun signalement enregistré.</div>}</div>
  </div>;
}
