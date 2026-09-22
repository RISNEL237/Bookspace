import Icone from "../../components/ui/Icone";
import React from "react";
import { Link } from "react-router-dom";
import { commandesClient, bibliothequeNumerique } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { CarteIndicateur } from "../../components/ui/Composants";

// PAGE : Vue d'ensemble du compte client (/compte)
// Résume les commandes en cours et la bibliothèque numérique.
export default function TableauDeBordCompte() {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="section-title"><span className="inline-flex items-center gap-1.5">Bonjour, Éléonore <Icone name="Sparkles" size={15} /></span></div>
          <div className="text-muted text-sm mt-1">
            Accédez à vos lectures en cours, vos envois postaux et vos
            garanties bibliophiles.
          </div>
        </div>
        <Link to="/compte/bibliotheque" className="btn-accent">
          <span className="inline-flex items-center gap-2"><Icone name="BookOpen" size={16} /> Accéder au lecteur web</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CarteIndicateur label={<span className="inline-flex items-center gap-1.5"><Icone name="Package" size={14} /> Commandes en cours</span>} value="3" foot="1 colis en transit" />
        <CarteIndicateur label={<span className="inline-flex items-center gap-1.5"><Icone name="Library" size={14} /> Bibliothèque numérique</span>} value="6" foot="Tatouage ePub sécurisé" />
        <CarteIndicateur label={<span className="inline-flex items-center gap-1.5"><Icone name="Gift" size={14} /> Crédit fidélité</span>} value="12,50 €" foot="Applicable à la prochaine commande" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6 items-start">
        <div className="flex-[1.5] w-full space-y-5">
          <div className="card">
            <div className="flex justify-between items-center mb-3.5">
              <div className="card-title mb-0"><span className="inline-flex items-center gap-2"><Icone name="Package" size={17} /> Suivi de mes commandes physiques</span></div>
              <Link to="/compte/commandes" className="text-sm font-bold text-accent-dark">
                Voir tout l'historique
              </Link>
            </div>
            {commandesClient.map((o) => (
              <Link
                key={o.id}
                to={`/compte/commandes/${o.id}`}
                className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0"
              >
                <CouvertureLivre cover={o.book.cover} className="w-[36px] h-[50px] shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{o.book.title}</div>
                  <div className="text-faint text-xs">#{o.id} · {o.seller}</div>
                </div>
                <span className={`pill-${o.statusTone}`}>{o.status}</span>
              </Link>
            ))}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-1">
              <div className="card-title mb-0"><span className="inline-flex items-center gap-2"><Icone name="Library" size={17} /> Ma bibliothèque numérique</span></div>
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
            <div className="card-title"><span className="inline-flex items-center gap-2"><Icone name="ShieldLock" size={17} /> Sécurité du compte</span></div>
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
            <div className="card-title"><span className="inline-flex items-center gap-2"><Icone name="MapPin" size={17} /> Adresse de livraison</span></div>
            <div className="text-muted text-sm leading-relaxed">
              Éléonore de Montalembert
              <br />
              14 Rue de l'Odéon
              <br />
              75006 Paris, France
            </div>
            <span className="pill-success mt-2.5 inline-flex items-center gap-1"><Icone name="Check" size={13} /> Adresse par défaut</span>
          </div>
        </div>
      </div>
    </div>
  );
}
