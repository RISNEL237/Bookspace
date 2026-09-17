import React from "react";
import { signalements } from "../../lib/donnees";
import { FlagTriangleRight } from "lucide-react";

// PAGE : Modération et signalements (/admin/moderation)
export default function Moderation() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="section-title"><FlagTriangleRight size={22} strokeWidth={2} className="text-rose-500 fill-rose-50" /> Signalements d'abus et de contrefaçon</div>
        <span className="pill-danger">{signalements.length} requêtes critiques</span>
      </div>
      <div className="card">
        <table className="table-base">
          <thead>
            <tr>
              <th>Date</th>
              <th>Offre signalée</th>
              <th>Motif</th>
              <th>Plaignant</th>
              <th>Arbitrage</th>
            </tr>
          </thead>
          <tbody>
            {signalements.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td className="font-bold">#{r.id} — {r.title}</td>
                <td>{r.reason}</td>
                <td>{r.reporter}</td>
                <td className="flex gap-2">
                  <button className="btn-danger-outline btn-sm">Masquer l'offre</button>
                  <button className="btn-outline btn-sm">Ouvrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card mt-5">
        <div className="card-title">Filtre anti-scrape</div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">Détection automatisée des écarts de prix vs Loi Lang (seuil ±5%)</span>
          <span className="pill-success">Actif</span>
        </div>
      </div>
    </div>
  );
}
