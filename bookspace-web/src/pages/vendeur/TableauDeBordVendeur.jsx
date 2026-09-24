import { Wallet, Truck, Star, TrendingUp } from "lucide-react";
import React from "react";
import { commandesVendeur } from "../../lib/donnees";
import { CarteIndicateur } from "../../components/ui/Composants";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Tableau de bord vendeur (/vendeur)
// Gains, commandes à expédier, meilleures ventes.
const bars = [55, 70, 40, 85, 60, 95, 75];
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function TableauDeBordVendeur() {
  return (
    <div>
      <div className="flex justify-between items-center bg-surface border border-border rounded p-6 mb-6">
        <div>
          <div className="section-title text-[22px]">Bonjour, Librairie Delamain</div>
          <div className="text-muted text-sm mt-1">
            Tableau de bord hybride — stocks physiques & publications
            numériques
          </div>
        </div>
        <div className="text-right">
          <div className="text-faint text-sm">Dernière synchro catalogue</div>
          <div className="font-bold text-sm">Aujourd'hui à 11:42</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <CarteIndicateur label="Gains nets du mois" value="1 245 €" delta="↑14%" foot="Versement le 15 du mois" />
        <CarteIndicateur label="Commandes à expédier" value="4" foot="Action requise" />
        <CarteIndicateur label="Téléchargements ePub" value="142" foot="Ventes numériques ce mois" />
        <CarteIndicateur label="Note boutique" value="4.9 " foot="1 420 avis vérifiés" />
      </div>

      <div className="flex flex-col md:flex-row gap-5 mt-5.5">
        <div className="flex-[1.4] card">
          <div className="flex justify-between items-center mb-1">
            <div className="card-title mb-0">Revenus des 7 derniers jours</div>
            <span className="pill-muted">Papier + numérique</span>
          </div>
          <div className="flex items-end gap-3.5 h-[140px] mt-4">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 bg-accent-pale rounded-t-[6px] relative h-full">
                <div className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-[6px]" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-faint mt-2">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 card">
          <div className="card-title">Meilleures ventes</div>
          {[
            ["cv1", "Les Mémoires de l'Ombre", "64 exemplaires"],
            ["cv5", "Lumières de l'Aube", "38 exemplaires"],
            ["cv6", "Traité d'Esthétique", "21 exemplaires"],
          ].map(([cv, t, n]) => (
            <div key={t} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
              <CouvertureLivre cover={cv} className="w-[30px] h-[42px] shrink-0" />
              <div>
                <div className="text-sm font-bold">{t}</div>
                <div className="text-faint text-xs">{n}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-5.5">
        <div className="flex justify-between items-center mb-3.5">
          <div className="card-title mb-0"> Commandes physiques à expédier</div>
          <span className="pill-danger">4 requises</span>
        </div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Titre</th>
              <th>Livraison</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandesVendeur.map((o) => (
              <tr key={o.id}>
                <td className="font-bold">#{o.id}</td>
                <td>{o.client}</td>
                <td>{o.title}</td>
                <td>{o.shipping}</td>
                <td>
                  <span className={`pill-${o.tone}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
