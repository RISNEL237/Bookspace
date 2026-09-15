import React from "react";
import { useParams } from "react-router-dom";
import { commandesClient } from "../../lib/donnees";
import { FilAriane } from "../../components/ui/Composants";

// PAGE : Suivi détaillé d'une commande (/compte/commandes/:id)
// Affiche une frise chronologique (timeline) de livraison.
const steps = [
  { icon: "✓", title: "Commande confirmée", desc: "Paiement validé, transmise à la librairie", done: true },
  { icon: "✓", title: "Colis préparé & emballé", desc: "Emballage éco-responsable renforcé", done: true },
  { icon: "🚚", title: "En transit — Colissimo", desc: "Pris en charge par le transporteur, centre de tri Paris", current: true },
  { icon: "⌂", title: "Livraison à domicile", desc: "Estimée le 21 février 2025", done: false },
];

export default function SuiviCommande() {
  const { id } = useParams();
  const order = commandesClient.find((o) => o.id === id) || commandesClient[0];

  return (
    <div>
      <FilAriane items={[{ label: "Mon compte", to: "/compte" }, { label: "Mes commandes", to: "/compte/commandes" }, { label: `#${order.id}` }]} />
      <div className="flex flex-col md:flex-row gap-7 px-10 pt-6 pb-10">
        <div className="flex-[1.5]">
          <div className="flex justify-between items-start mb-1">
            <div className="section-title">Suivi de la commande #{order.id}</div>
            <span className="pill-info">En transit</span>
          </div>
          <div className="text-muted text-sm mb-5">
            {order.book.title} — Livre broché · Expédié par {order.seller}
          </div>

          <div className="card">
            <div className="card-title">📦 Historique de livraison</div>
            <div className="relative pl-9 mt-5">
              <div className="absolute left-[11px] top-1.5 bottom-1.5 w-0.5 bg-border" />
              {steps.map((s, i) => (
                <div key={i} className="relative pb-7 last:pb-0">
                  <div
                    className={`absolute -left-9 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${s.current ? "bg-primary text-white" : s.done ? "bg-success text-white" : "bg-surfaceAlt text-faint border-2 border-borderStrong"}`}
                  >
                    {s.icon}
                  </div>
                  <div className="font-bold text-sm mb-0.5">{s.title}</div>
                  <div className="text-muted text-sm">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[340px] shrink-0">
          <div className="h-[180px] bg-surfaceAlt rounded flex items-center justify-center text-faint text-sm border border-dashed border-borderStrong mb-4.5">
            🗺️ Carte de suivi du colis
          </div>
          <div className="card">
            <div className="card-title">Détails de l'envoi</div>
            {[
              ["Transporteur", "Colissimo Suivi"],
              ["N° de suivi", "8L0234 5671 09FR"],
              ["Adresse", "14 Rue de l'Odéon, Paris"],
              ["Livraison estimée", "21 février 2025"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[12.5px] py-2 border-b border-border last:border-b-0">
                <span className="text-muted">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
            <button className="btn-outline btn-sm w-full mt-3.5">Contacter la librairie</button>
          </div>
        </div>
      </div>
    </div>
  );
}
