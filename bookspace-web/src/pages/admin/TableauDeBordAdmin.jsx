import React, { useEffect, useState } from "react";
import { fetchAdminSellers, updateSellerStatus } from "../../lib/api";
import { CarteIndicateur } from "../../components/ui/Composants";

export default function TableauDeBordAdmin() {
  const [vendeurs, setVendeurs] = useState([]);
  const [erreur, setErreur] = useState("");
  useEffect(() => { fetchAdminSellers().then(setVendeurs).catch((error) => setErreur(error.message)); }, []);
  const enAttente = vendeurs.filter((vendeur) => vendeur.kyb_status === "pending");

  async function changerStatut(id, statut) {
    try {
      const updated = await updateSellerStatus(id, statut);
      setVendeurs((current) => current.map((seller) => seller.id === updated.id ? updated : seller));
    } catch (error) { setErreur(error.message); }
  }

  return <div>
    <div className="section-title">Supervision de la plateforme</div>
    <div className="text-muted text-sm mt-1 mb-5">Indicateurs calculés à partir des vendeurs enregistrés.</div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <CarteIndicateur label="Vendeurs enregistrés" value={String(vendeurs.length)} />
      <CarteIndicateur label="Demandes de validation en attente" value={String(enAttente.length)} />
    </div>
    <div className="card overflow-x-auto"><div className="card-title">Demandes d'activation vendeurs</div>
      <table className="table-base"><thead><tr><th>Nom commercial</th><th>Structure</th><th>Pays</th><th>Actions</th></tr></thead>
        <tbody>{enAttente.map((seller) => <tr key={seller.id}><td className="font-bold">{seller.shop_name}</td><td>{seller.legal_type || "—"}</td><td>{seller.country || "—"}</td><td className="flex gap-2"><button onClick={() => changerStatut(seller.id, "approved")} className="btn-success-outline btn-sm">Valider</button><button onClick={() => changerStatut(seller.id, "rejected")} className="btn-danger-outline btn-sm">Rejeter</button></td></tr>)}</tbody>
      </table>
      {!erreur && enAttente.length === 0 && <div className="text-muted text-sm p-3">Aucune demande en attente.</div>}
    </div>
  </div>;
}
