import React from "react";
import { Link } from "react-router-dom";
import { livres } from "../../lib/donnees";
import { CarteLivreGrille } from "../../components/livres/CartesLivres";

// PAGE : Accueil du site (/)
// Vitrine, meilleures ventes et arguments de confiance.
export default function Accueil() {
  return (
    <div>
      <div className="bg-primary text-white px-16 py-16 relative overflow-hidden">
        <div className="max-w-[680px] relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold mb-5">
            📚 Plateforme littéraire hybride
          </div>
          <h1 className="font-head text-[42px] leading-tight font-bold mb-4">
            Le livre papier et numérique,
            <br /> réunis sur une seule place de marché.
          </h1>
          <p className="text-white/75 text-[15px] leading-relaxed mb-7 max-w-[560px]">
            Achetez vos livres imprimés auprès de librairies indépendantes ou
            téléchargez instantanément vos e-livres — en toute sécurité, au
            prix unique du livre.
          </p>
          <div className="flex gap-3.5">
            <Link to="/catalogue" className="btn-accent">
              Explorer le catalogue
            </Link>
            <Link to="/vendeur/inscription" className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20">
              Devenir vendeur
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-surface border-b border-border px-16 py-5 flex flex-wrap gap-6">
        {[
          ["🏬", "+120", "Librairies partenaires"],
          ["📖", "50 000+", "Titres papier & numérique"],
          ["🔒", "DRM social", "Fichiers protégés & tatoués"],
          ["⚖️", "Prix unique", "Conforme à la réglementation"],
        ].map(([icon, val, label]) => (
          <div key={label} className="flex-1 min-w-[200px] flex gap-3 items-center">
            <div className="icon-circle w-[38px] h-[38px] rounded-[10px] bg-accent-pale text-accent-dark flex items-center justify-center text-base shrink-0">
              {icon}
            </div>
            <div>
              <b className="block font-head text-lg text-primary">{val}</b>
              <span className="text-[11.5px] text-muted">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-16 py-11">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="section-title">Meilleures ventes du moment</div>
            <div className="text-muted text-sm">
              Disponibles en livraison libraire ou en téléchargement immédiat
            </div>
          </div>
          <Link to="/catalogue" className="btn-outline btn-sm">
            Voir toute la sélection →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {livres.slice(0, 4).map((b) => (
            <CarteLivreGrille key={b.id} book={b} />
          ))}
        </div>
      </div>

      <div className="px-16 pb-14">
        <div className="section-title mb-6">Pourquoi choisir BookSpace ?</div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["🏪", "Soutien aux librairies", "Chaque commande papier est préparée et expédiée par une librairie indépendante."],
            ["⚡", "Lecture immédiate", "Vos e-livres sont ajoutés en un instant à votre bibliothèque cloud sécurisée."],
            ["🛡️", "Transactions sécurisées", "Paiement chiffré et répartition automatique entre les vendeurs."],
          ].map(([icon, title, text]) => (
            <div key={title} className="card">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-accent-pale text-accent-dark flex items-center justify-center text-base mb-3.5">
                {icon}
              </div>
              <div className="font-bold mb-1.5">{title}</div>
              <div className="text-muted text-sm">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
