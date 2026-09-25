import { Wallet, Truck, Star, TrendingUp } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { fetchSellerOrders } from "../../lib/api";
import { CarteIndicateur } from "../../components/ui/Composants";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Tableau de bord vendeur (/vendeur)
// Gains, commandes à expédier, meilleures ventes.
const bars = [55, 70, 40, 85, 60, 95, 75];
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function TableauDeBordVendeur() {
  const [commandes, definirCommandes] = useState([]);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    fetchSellerOrders()
      .then(definirCommandes)
      .catch((error) => definirErreur(error.message));
  }, []);

  const commandesEnCours = commandes.filter((commande) => !["delivered", "paid", "cancelled"].includes(commande.status));
  const revenus = commandes.reduce((total, commande) => total + Number(commande.unit_price || 0) * Number(commande.quantity || 0), 0);
  const meilleuresVentes = useMemo(() => {
    const ventes = new Map();
    commandes.forEach((commande) => {
      const titre = commande.book?.title || "Article indisponible";
      ventes.set(titre, (ventes.get(titre) || 0) + Number(commande.quantity || 0));
    });
    return [...ventes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [commandes]);

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
        <CarteIndicateur label="Revenus des commandes" value={`${revenus.toFixed(2)} €`} foot="Articles de vos commandes" />
        <CarteIndicateur label="Commandes à expédier" value={String(commandesEnCours.length)} foot="Données en temps réel" />
        <CarteIndicateur label="Articles vendus" value={String(commandes.reduce((total, commande) => total + Number(commande.quantity || 0), 0))} foot="Quantités commandées" />
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
          {meilleuresVentes.map(([titre, quantite]) => (
            <div key={titre} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
              <CouvertureLivre graine={titre} className="w-[30px] h-[42px] shrink-0" />
              <div>
                <div className="text-sm font-bold">{titre}</div>
                <div className="text-faint text-xs">{quantite} exemplaire{quantite > 1 ? "s" : ""}</div>
              </div>
            </div>
          ))}
          {meilleuresVentes.length === 0 && <div className="text-muted text-sm">Aucune vente enregistrée.</div>}
        </div>
      </div>

      <div className="card mt-5.5">
        <div className="flex justify-between items-center mb-3.5">
          <div className="card-title mb-0"> Commandes physiques à expédier</div>
          <span className="pill-danger">{commandesEnCours.length} requise{commandesEnCours.length > 1 ? "s" : ""}</span>
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
            {erreur && <tr><td colSpan="5" className="text-danger">{erreur}</td></tr>}
            {!erreur && commandes.slice(0, 4).map((item) => (
              <tr key={item.id}>
                <td className="font-bold">#{item.order_id}</td>
                <td>{item.order?.client?.full_name || "Client BookSpace"}</td>
                <td>{item.book?.title || "Article indisponible"}</td>
                <td>{Number(item.shipping_fee || 0) > 0 ? "Colissimo" : "Click & Collect"}</td>
                <td>
                  <span className="pill-info">{item.status || "pending"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
