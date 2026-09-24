import React from "react";
import { Link } from "react-router-dom";
import CouvertureLivre from "../ui/CouvertureLivre";
import { Etoiles } from "../ui/Composants";
import { Store, ArrowRight } from "lucide-react";

// Cartes d'affichage d'un livre, utilisées dans les grilles
// (page d'accueil, catalogue, résultats de recherche).
// Le bouton mène à la fiche produit (comparaison des vendeurs) plutôt
// que d'ajouter directement au panier, puisqu'un livre peut être
// proposé par plusieurs libraires à des prix différents.
export function CarteLivreGrille({ book }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-pop transition-shadow">
      <Link to={`/livre/${book.id}`}>
        <CouvertureLivre graine={book.id} className="rounded-none" ratio="3/4" />
      </Link>
      <div className="p-4 flex flex-col gap-1">
        <Link to={`/livre/${book.id}`} className="font-head font-bold text-[14.5px] leading-tight hover:text-accent-dark">
          {book.title}
        </Link>
        <div className="text-xs text-muted mb-2">{book.author}</div>
        <Etoiles rating={book.rating} />
        <div className="flex items-center justify-between mt-2.5">
          <div className="text-sm">
            <span className="text-faint text-[10px] block leading-none mb-0.5">dès</span>
            <b className="font-head text-base text-accent">{book.priceEbook.toFixed(2)} €</b>
          </div>
          <Link to={`/livre/${book.id}`} className="btn-accent btn-sm flex items-center gap-1.5">
            <Store size={13} /> Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CarteLivreResultat({ book }) {
  return (
    <Link to={`/livre/${book.id}`} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-pop transition-shadow block">
      <CouvertureLivre graine={book.id} className="rounded-none" ratio="3/4" />
      <div className="p-3.5">
        <div className="font-head font-bold text-[13.5px] leading-snug mb-0.5">{book.title}</div>
        <div className="text-[11.5px] text-muted mb-2">{book.author}</div>
        <Etoiles rating={book.rating} />
        <div className="flex justify-between items-center mt-2.5">
          <b className="font-head text-[15px] text-accent">dès {book.priceEbook.toFixed(2)} €</b>
          <span className="text-accent-dark flex items-center gap-0.5 text-xs font-bold">
            Voir <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
