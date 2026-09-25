import { Truck } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { fetchSellerOrders } from "../../lib/api";

// PAGE : Commandes à expédier (/vendeur/commandes)
export default function CommandesVendeur() {
  const [onglet, definirOnglet] = useState(0);
  const [commandes, definirCommandes] = useState([]);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    fetchSellerOrders()
      .then(definirCommandes)
      .catch((error) => definirErreur(error.message));
  }, []);

  const tabs = useMemo(() => [
    `Toutes (${commandes.length})`,
    `Colissimo (${commandes.filter((commande) => Number(commande.shipping_fee || 0) > 0).length})`,
    `Click & Collect (${commandes.filter((commande) => Number(commande.shipping_fee || 0) === 0).length})`,
  ], [commandes]);

  const commandesFiltrees = commandes.filter((commande) => {
    if (onglet === 1) return Number(commande.shipping_fee || 0) > 0;
    if (onglet === 2) return Number(commande.shipping_fee || 0) === 0;
    return true;
  });

  return (
    <div>
      <div className="section-title mb-5">Commandes à expédier</div>
      <div className="card">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="card-title mb-0"> Commandes physiques à traiter</div>
          <div className="flex gap-2.5">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => definirOnglet(i)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-bold border ${i === onglet ? "bg-primary text-white border-primary" : "text-muted border-borderStrong"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {erreur && <div className="text-danger text-sm mb-4">{erreur}</div>}
        {!erreur && commandes.length === 0 && <div className="text-muted text-sm mb-4">Aucune commande à traiter.</div>}
        <table className="table-base">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Titre</th>
              <th>Livraison</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {commandesFiltrees.map((item) => (
              <tr key={item.id}>
                <td className="font-bold">#{item.order_id}</td>
                <td>{item.order?.client?.full_name || "Client BookSpace"}</td>
                <td>{item.book?.title || "Article indisponible"}</td>
                <td>{Number(item.shipping_fee || 0) > 0 ? "Colissimo" : "Click & Collect"}</td>
                <td><span className="pill-info">{item.status || "pending"}</span></td>
                <td><button className="btn-outline btn-sm">Traiter</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
