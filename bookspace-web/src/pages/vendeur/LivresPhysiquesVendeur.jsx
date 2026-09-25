import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSellerOffers } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { formatMoney } from "../../lib/api";

export default function LivresPhysiquesVendeur() {
  const [offres, setOffres] = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchSellerOffers().then(setOffres).catch((error) => setErreur(error.message));
  }, []);

  const livres = offres.filter((offre) => offre.type === "physique");
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div><div className="section-title">Mes livres physiques</div><div className="text-muted text-sm mt-1">Gestion des stocks et prix de vos ouvrages papier.</div></div>
        <Link to="/vendeur/livres/nouveau" className="btn-primary">+ Ajouter un ouvrage</Link>
      </div>
      {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
      <div className="card overflow-x-auto">
        <table className="table-base"><thead><tr><th>Ouvrage</th><th>ISBN</th><th>Stock</th><th>Prix</th><th>Statut</th></tr></thead>
          <tbody>{livres.map((offre) => <tr key={offre.id}>
            <td><div className="flex items-center gap-3"><CouvertureLivre cover={offre.book?.cover} className="w-8 h-11 shrink-0" /><div><div className="font-bold">{offre.book?.title || "Livre indisponible"}</div><div className="text-faint text-xs">{offre.book?.author}</div></div></div></td>
            <td className="text-faint text-xs">{offre.book?.isbn || "—"}</td><td>{offre.stock ?? "—"}</td><td className="font-bold">{formatMoney(offre.price)}</td>
            <td><span className={offre.available && offre.status === "active" ? "pill-success" : "pill-warning"}>{offre.available && offre.status === "active" ? "En vente" : "Indisponible"}</span></td>
          </tr>)}</tbody>
        </table>
        {!erreur && livres.length === 0 && <div className="text-muted text-sm p-3">Aucune offre physique enregistrée.</div>}
      </div>
    </div>
  );
}
