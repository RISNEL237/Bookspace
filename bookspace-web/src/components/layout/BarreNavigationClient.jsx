import { BookOpen, Heart, Search, ShoppingCart } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

// Barre de navigation du haut de page, visible sur tout l'espace client
// (logo, menu, recherche, panier, compte).
export default function BarreNavigationClient() {
  return (
    <div className="bg-surface border-b border-border px-10 py-4 flex items-center gap-9">
      <Link to="/" className="font-head text-2xl font-bold text-primary flex items-center gap-2 whitespace-nowrap">
        <BookOpen /> BookSpace
      </Link>
      <div className="hidden md:flex gap-7 text-sm text-muted font-medium">
        <NavLink to="/catalogue" className={({ isActive }) => (isActive ? "text-primary font-bold" : "")}>
          Catalogue
        </NavLink>
        <NavLink to="/catalogue?type=libraries" className="hover:text-primary">
          Librairies partenaires
        </NavLink>
        <NavLink to="/vendeur/inscription" className="hover:text-primary">
          Vendre sur BookSpace
        </NavLink>
      </div>
      <div className="flex-1 max-w-[420px] flex items-center gap-2.5 bg-surfaceAlt border border-border rounded-full px-4.5 py-2.5 text-sm text-faint">
        <Search /> <span>Rechercher un titre, un auteur, un ISBN…</span>
      </div>
      <div className="flex items-center gap-5 ml-auto text-[13px] text-muted">
        <Link to="/compte/envies" className="flex flex-col items-center gap-1 font-semibold text-primary">
          <Heart /><span>Favoris</span>
        </Link>
        <Link to="/panier" className="relative flex flex-col items-center gap-1 font-semibold text-primary">
          <ShoppingCart /><span>Panier</span>
          <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </Link>
        <Link
          to="/compte"
          className="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-bold"
        >
          EM
        </Link>
      </div>
    </div>
  );
}
