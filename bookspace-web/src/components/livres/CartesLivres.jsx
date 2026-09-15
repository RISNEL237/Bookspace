import React from "react";
import { Link } from "react-router-dom";
import CouvertureLivre from "../ui/CouvertureLivre";
import { Etoiles } from "../ui/Composants";

// Cartes d'affichage d'un livre, utilisées dans les grilles
// (page d'accueil, catalogue, résultats de recherche).
export function CarteLivreGrille({ book }) {
  return (
    <div className="bg-surface border border-border rounded overflow-hidden flex flex-col">
      <Link to={`/livre/${book.id}`}>
        <CouvertureLivre cover={book.cover} className="h-[190px] rounded-none" />
      </Link>
      <div className="p-4 flex flex-col gap-1">
        <Link to={`/livre/${book.id}`} className="font-head font-bold text-[14.5px] leading-tight hover:text-accent-dark">
          {book.title}
        </Link>
        <div className="text-xs text-muted mb-2">{book.author}</div>
        <div className="flex gap-2 mb-3 text-xs">
          <div className="flex-1 bg-surfaceAlt rounded-[7px] px-2.5 py-1.5">
            Papier
            <b className="block text-[13px] text-primary">{book.pricePaper.toFixed(2)} €</b>
          </div>
          <div className="flex-1 bg-surfaceAlt rounded-[7px] px-2.5 py-1.5">
            E-pub
            <b className="block text-[13px] text-primary">{book.priceEbook.toFixed(2)} €</b>
          </div>
        </div>
        <button className="btn-primary btn-sm w-full">Ajouter au panier</button>
      </div>
    </div>
  );
}

export function CarteLivreResultat({ book }) {
  return (
    <div className="bg-surface border border-border rounded overflow-hidden">
      <Link to={`/livre/${book.id}`}>
        <CouvertureLivre cover={book.cover} className="h-[178px] rounded-none" />
      </Link>
      <div className="p-3.5">
        <Link to={`/livre/${book.id}`} className="font-head font-bold text-[13.5px] leading-snug hover:text-accent-dark block mb-0.5">
          {book.title}
        </Link>
        <div className="text-[11.5px] text-muted mb-2">{book.author}</div>
        <Etoiles rating={book.rating} />
        <div className="flex justify-between items-center mt-2.5">
          <b className="font-head text-[15px] text-primary">{book.pricePaper.toFixed(2)} €</b>
          <span className="pill-accent">Papier</span>
        </div>
      </div>
    </div>
  );
}
