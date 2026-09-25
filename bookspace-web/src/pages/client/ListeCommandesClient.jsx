import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Liste des commandes du client (/compte/commandes)
export default function ListeCommandesClient() {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchOrders()
      .then(setCommandes)
      .catch((error) => setErreur(error.message))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div>
      <div className="section-title mb-5">Mes commandes</div>
      <div className="card">
        {chargement && <div className="text-muted text-sm">Chargement de vos commandes…</div>}
        {erreur && <div className="text-danger text-sm">{erreur}</div>}
        {!chargement && !erreur && commandes.length === 0 && <div className="text-muted text-sm">Vous n'avez pas encore de commande.</div>}
        {commandes.map((o) => (
          <Link
            key={o.id}
            to={`/compte/commandes/${o.id}`}
            className="flex items-center gap-4 py-4 border-b border-border last:border-b-0 hover:bg-surfaceAlt -mx-5 px-5"
          >
            <CouvertureLivre graine={o.items?.[0]?.book_id || o.id} className="w-[36px] h-[50px] shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-sm">{o.items?.[0]?.book?.title || `${o.items?.length || 0} article(s)`}</div>
              <div className="text-faint text-xs">#{o.id}</div>
            </div>
            <div className="text-muted text-xs">{o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : "-"}</div>
            <span className="pill-info">{o.status || "pending"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
