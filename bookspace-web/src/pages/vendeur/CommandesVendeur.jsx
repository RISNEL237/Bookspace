import React, { useEffect, useMemo, useState } from "react";
import { fetchSellerOrders, updateSellerOrderLine } from "../../lib/api";

const libelleStatut = { payee: "Payée", en_preparation: "En préparation", en_expedition: "Expédiée", livree: "Livrée", fond_reverse: "Terminée", remboursee: "Remboursée" };

export default function CommandesVendeur() {
  const [onglet, setOnglet] = useState("toutes");
  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur] = useState("");
  const [miseAJour, setMiseAJour] = useState(null);
  useEffect(() => { fetchSellerOrders().then(setCommandes).catch((error) => setErreur(error.message)); }, []);
  const tabs = useMemo(() => [
    ["toutes", `Toutes (${commandes.length})`],
    ["preparation", `À préparer (${commandes.filter((line) => line.status === "payee").length})`],
    ["expedition", `À expédier (${commandes.filter((line) => line.status === "en_preparation").length})`],
  ], [commandes]);
  const visibles = commandes.filter((line) => onglet === "preparation" ? line.status === "payee" : onglet === "expedition" ? line.status === "en_preparation" : true);

  async function avancer(line) {
    const status = line.status === "payee" ? "en_preparation" : "en_expedition";
    setErreur(""); setMiseAJour(line.id);
    try {
      const updated = await updateSellerOrderLine(line.id, status);
      setCommandes((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) { setErreur(error.message); } finally { setMiseAJour(null); }
  }

  return <div><div className="section-title mb-5">Commandes vendeur</div><div className="card overflow-x-auto">
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3"><div className="card-title mb-0">Lignes de commande</div><div className="flex gap-2">{tabs.map(([key, label]) => <button key={key} onClick={() => setOnglet(key)} className={`px-4 py-2 rounded-full text-xs font-bold border ${onglet === key ? "bg-primary text-white border-primary" : "text-muted border-borderStrong"}`}>{label}</button>)}</div></div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <table className="table-base"><thead><tr><th>Commande</th><th>Client</th><th>Livre</th><th>Mode</th><th>Statut</th><th>Action</th></tr></thead><tbody>
      {visibles.map((line) => <tr key={line.id}><td className="font-bold">#{line.order_id}</td><td>{line.order?.client?.full_name || "—"}</td><td>{line.book?.title || "—"}</td><td>{line.delivery_mode === "domicile" ? "Livraison" : line.delivery_mode === "retrait" ? "Retrait" : "Numérique"}</td><td>{libelleStatut[line.status] || line.status}</td><td>{["payee", "en_preparation"].includes(line.status) && <button type="button" disabled={miseAJour === line.id} onClick={() => avancer(line)} className="btn-outline btn-sm disabled:opacity-50">{line.status === "payee" ? "Préparer" : "Marquer expédiée"}</button>}</td></tr>)}
    </tbody></table>
    {!erreur && visibles.length === 0 && <div className="text-muted text-sm p-3">Aucune ligne dans ce filtre.</div>}
  </div></div>;
}
