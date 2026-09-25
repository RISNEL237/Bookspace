import React, { useEffect, useMemo, useState } from "react";
import { fetchSellerOrders, fetchSellerProfile, formatMoney } from "../../lib/api";
import { CarteIndicateur } from "../../components/ui/Composants";

export default function TableauDeBordVendeur() {
  const [commandes, setCommandes] = useState([]);
  const [vendeur, setVendeur] = useState(null);
  const [erreur, setErreur] = useState("");
  useEffect(() => {
    Promise.all([fetchSellerOrders(), fetchSellerProfile()]).then(([orders, profile]) => { setCommandes(orders); setVendeur(profile); }).catch((error) => setErreur(error.message));
  }, []);
  const ventes = useMemo(() => {
    const map = new Map();
    commandes.forEach((item) => map.set(item.book?.title || "Livre indisponible", (map.get(item.book?.title || "Livre indisponible") || 0) + Number(item.quantity || 0)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [commandes]);
  const enCours = commandes.filter((item) => !["livree", "fond_reverse", "remboursee"].includes(item.status));
  const revenus = commandes.reduce((total, item) => total + Number(item.unit_price || 0) * Number(item.quantity || 0), 0);

  return <div><div className="bg-surface border border-border rounded p-6 mb-6"><div className="section-title text-[22px]">Bonjour{vendeur?.shop_name ? `, ${vendeur.shop_name}` : ""}</div><div className="text-muted text-sm mt-1">Activité issue de vos commandes.</div></div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"><CarteIndicateur label="Montant des lignes commandées" value={formatMoney(revenus)} /><CarteIndicateur label="Lignes à traiter" value={String(enCours.length)} /><CarteIndicateur label="Quantités commandées" value={String(commandes.reduce((sum, order) => sum + Number(order.quantity || 0), 0))} /></div>
    <div className="card mt-5"><div className="card-title">Articles les plus commandés</div>{ventes.map(([title, count]) => <div key={title} className="flex justify-between py-2 border-b border-border last:border-0"><span>{title}</span><b>{count}</b></div>)}{!erreur && ventes.length === 0 && <div className="text-muted text-sm">Aucune ligne de commande.</div>}</div>
  </div>;
}
