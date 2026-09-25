import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { confirmOrderDelivery, fetchOrderById } from "../../lib/api";
import { FilAriane } from "../../components/ui/Composants";
import { Package } from "lucide-react";

const statuts = {
  en_attente_paiement: "En attente de paiement",
  payee: "Paiement confirmé",
  en_preparation: "En préparation",
  en_expedition: "Expédiée",
  livree: "Livrée",
  fond_reverse: "Fonds reversés",
  remboursee: "Remboursée",
  disponible_telechargement: "Téléchargement disponible",
};

export default function SuiviCommande() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [erreur, setErreur] = useState("");
  const [validation, setValidation] = useState(null);
  useEffect(() => { fetchOrderById(id).then(setCommande).catch((error) => setErreur(error.message)); }, [id]);
  if (erreur) return <div className="px-4 py-10 text-danger">{erreur}</div>;
  if (!commande) return <div className="px-4 py-10 text-muted">Chargement de la commande…</div>;

  async function confirmerReception(lineId) {
    setErreur(""); setValidation(lineId);
    try {
      await confirmOrderDelivery(commande.id, lineId);
      setCommande((current) => ({ ...current, items: current.items.map((item) => item.id === lineId ? { ...item, status: "livree" } : item) }));
    } catch (error) { setErreur(error.message); } finally { setValidation(null); }
  }

  return <div><FilAriane items={[{ label: "Mon compte", to: "/compte" }, { label: "Mes commandes", to: "/compte/commandes" }, { label: `#${commande.id}` }]} />
    <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-10"><div className="section-title">Commande #{commande.id}</div><div className="text-muted text-sm mb-5">État : {commande.status} · {commande.created_at ? new Date(commande.created_at).toLocaleDateString("fr-FR") : ""}</div>
      <div className="card"><div className="card-title flex items-center gap-2"><Package size={16} />Articles</div>{(commande.items || []).map((item) => <div key={item.id} className="flex justify-between items-center gap-4 py-3 border-b border-border last:border-0"><div><b>{item.book?.title || "Livre"}</b><div className="text-muted text-sm">{item.delivery_mode === "telechargement" ? "Numérique" : item.delivery_mode === "domicile" ? "Livraison à domicile" : "Retrait"}</div></div><div className="flex items-center gap-3"><span className="pill-info">{statuts[item.status] || item.status}</span>{item.status === "en_expedition" && <button type="button" disabled={validation === item.id} onClick={() => confirmerReception(item.id)} className="btn-outline btn-sm disabled:opacity-50">Confirmer la réception</button>}</div></div>)}</div>
      <div className="text-muted text-sm mt-4">Les informations de transport et de suivi seront affichées lorsqu’elles seront disponibles auprès du vendeur.</div>
    </div>
  </div>;
}
