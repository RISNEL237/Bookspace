import React, { useEffect, useState } from "react";
import { fetchCommissions, updateCommission } from "../../lib/api";

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [erreur, setErreur] = useState("");
  const [enregistrement, setEnregistrement] = useState(null);
  useEffect(() => { fetchCommissions().then(setCommissions).catch((error) => setErreur(error.message)); }, []);

  async function enregistrer(commission) {
    setErreur(""); setEnregistrement(commission.id);
    try {
      const saved = await updateCommission(commission.id, commission.taux);
      setCommissions((current) => current.map((item) => item.id === saved.id ? saved : item));
    } catch (error) { setErreur(error.message); } finally { setEnregistrement(null); }
  }

  return <div><div className="section-title mb-1">Commissions de la marketplace</div><div className="text-muted text-sm mb-6">Taux configurés dans la base de données. Les taux peuvent être modifiés par un administrateur.</div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{commissions.map((commission) => <div className="card" key={commission.id}>
      <div className="card-title">Offres {commission.type_offre === "physique" ? "physiques" : "numériques"}</div>
      <label className="field"><span>Taux (%)</span><input type="number" min="0" max="100" step="0.01" className="input" value={commission.taux} onChange={(event) => setCommissions((current) => current.map((item) => item.id === commission.id ? { ...item, taux: event.target.value } : item))} /></label>
      <button type="button" disabled={enregistrement === commission.id} onClick={() => enregistrer(commission)} className="btn-primary btn-sm disabled:opacity-60">{enregistrement === commission.id ? "Enregistrement…" : "Enregistrer"}</button>
      <div className="text-faint text-xs mt-3">Dernière modification : {commission.date_modification ? new Date(commission.date_modification).toLocaleString("fr-FR") : "—"}</div>
    </div>)}</div>
    {!erreur && commissions.length === 0 && <div className="text-muted text-sm">Aucun taux de commission configuré.</div>}
  </div>;
}
