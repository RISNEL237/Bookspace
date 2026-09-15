import React from "react";
import { Link } from "react-router-dom";
import { commandesClient } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Liste des commandes du client (/compte/commandes)
export default function ListeCommandesClient() {
  return (
    <div>
      <div className="section-title mb-5">Mes commandes</div>
      <div className="card">
        {commandesClient.map((o) => (
          <Link
            key={o.id}
            to={`/compte/commandes/${o.id}`}
            className="flex items-center gap-4 py-4 border-b border-border last:border-b-0 hover:bg-surfaceAlt -mx-5 px-5"
          >
            <CouvertureLivre cover={o.book.cover} className="w-[36px] h-[50px] shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-sm">{o.book.title}</div>
              <div className="text-faint text-xs">#{o.id} · {o.seller}</div>
            </div>
            <div className="text-muted text-xs">{o.date}</div>
            <span className={`pill-${o.statusTone}`}>{o.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
