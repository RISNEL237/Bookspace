import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bibliothequeNumerique } from "../../lib/donnees";
import { fetchOrders } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { CarteIndicateur } from "../../components/ui/Composants";
import { BookOpen, Package, BookMarked, Gift, MapPin, ShieldCheck, KeyRound } from "lucide-react";

// PAGE : Vue d'ensemble du compte client (/compte)
// Résume les commandes en cours et la bibliothèque numérique.
export default function TableauDeBordCompte() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    fetchOrders().then(setCommandes).catch(() => setCommandes([]));
  }, []);

  const commandesEnCours = commandes.filter((commande) => !["delivered", "cancelled"].includes(commande.status));
  const titresNumeriques = commandes.reduce(
    (total, commande) => total + (commande.items || []).filter((item) => /epub|pdf/i.test(item.format || "")).length,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="section-title">Bonjour, Éléonore</div>
          <div className="text-muted text-sm mt-1">
            Accédez à vos lectures en cours, vos envois postaux et vos
            garanties bibliophiles.
          </div>
        </div>
        <Link to="/compte/bibliotheque" className="btn-accent">
          <BookOpen size={16} className="inline mr-1.5 -mt-0.5" /> Accéder au lecteur web
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CarteIndicateur label="Commandes en cours" value={String(commandesEnCours.length)} foot="Suivi depuis votre espace" />
        <CarteIndicateur label="Bibliothèque numérique" value={String(titresNumeriques)} foot="Titres issus de vos commandes" />
        <CarteIndicateur label="Crédit fidélité" value="12,50 €" foot="Applicable à la prochaine commande" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6 items-start">
        <div className="flex-[1.5] w-full space-y-5">
          <div className="card">
            <div className="flex justify-between items-center mb-3.5">
              <div className="card-title mb-0 flex items-center gap-2"><Package size={16} /> Suivi de mes commandes physiques</div>
              <Link to="/compte/commandes" className="text-sm font-bold text-accent-dark">
                Voir tout l'historique
              </Link>
            </div>
            {commandes.slice(0, 3).map((o) => {
              const article = o.items?.[0];
              return (
              <Link
                key={o.id}
                to={`/compte/commandes/${o.id}`}
                className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0"
              >
                <CouvertureLivre graine={article?.book_id || o.id} className="w-[36px] h-[50px] shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{article?.book?.title || `${o.items?.length || 0} article(s)`}</div>
                  <div className="text-faint text-xs">#{o.id}</div>
                </div>
                <span className="pill-info">{o.status || "pending"}</span>
              </Link>
              );
            })}
            {commandes.length === 0 && <div className="text-muted text-sm">Aucune commande enregistrée pour le moment.</div>}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-1">
              <div className="card-title mb-0 flex items-center gap-2"><BookMarked size={16} /> Ma bibliothèque numérique</div>
              <Link to="/compte/bibliotheque" className="text-sm font-bold text-accent-dark">
                Voir les 6 titres
              </Link>
            </div>
            <div className="card-sub">Prêts au téléchargement et synchronisés sur vos liseuses</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bibliothequeNumerique.map((b) => (
                <div key={b.id} className="bg-surface border border-border rounded p-4 flex gap-3.5">
                  <CouvertureLivre cover={b.cover} tag={b.format} className="w-14 h-14 shrink-0" />
                  <div>
                    <div className="font-head font-bold text-[13px]">{b.title}</div>
                    <div className="text-faint text-xs mb-2">{b.author}</div>
                    <button className="btn-primary btn-sm">Lire</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[320px] shrink-0 space-y-5">
          <div className="card">
            <div className="card-title flex items-center gap-2"><ShieldCheck size={16} /> Sécurité du compte</div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-muted">Double authentification</span>
              <span className="pill-success">Active</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted">Dernière connexion</span>
              <span className="font-bold">Aujourd'hui, 14:15</span>
            </div>
            <Link to="/compte/parametres" className="btn-outline btn-sm w-full">
              Modifier mon mot de passe
            </Link>
          </div>
          <div className="card">
            <div className="card-title flex items-center gap-2"><MapPin size={16} /> Adresse de livraison</div>
            <div className="text-muted text-sm leading-relaxed">
              Éléonore de Montalembert
              <br />
              14 Rue de l'Odéon
              <br />
              75006 Paris, France
            </div>
            <span className="pill-success mt-2.5 inline-block">Adresse par défaut</span>
          </div>
        </div>
      </div>
    </div>
  );
}
