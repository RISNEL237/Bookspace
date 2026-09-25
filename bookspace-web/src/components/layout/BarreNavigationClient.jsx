import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";

// Barre de navigation du haut de page, visible sur tout l'espace client.
export default function BarreNavigationClient() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const liens = [
    { to: "/", label: "Accueil", end: true },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/carnets-critiques", label: "Sélections Critiques" },
    { to: "/librairies", label: "Librairies Partenaires" },
  ];

  return (
    <div>
      <div className="bg-accent text-white text-center text-[11.5px] sm:text-[12.5px] font-semibold py-2 px-4">
        Catalogue numérique et livres proposés par les vendeurs actifs
      </div>

      <div className="bg-surface border-b border-border px-4 sm:px-6 lg:px-10 py-3 lg:py-4 flex items-center gap-3 lg:gap-8">
        <Link to="/" className="font-head text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
          <span className="text-ink">Book</span>
          <span className="text-accent">Space</span>
        </Link>

        <div className="hidden lg:flex gap-6 text-sm font-semibold text-ink shrink-0">
          {liens.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "text-accent" : "hover:text-accent")}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden sm:flex flex-1 items-center gap-2.5 bg-surfaceAlt border border-border rounded-full px-4.5 py-2.5 text-sm text-faint min-w-0">
          <Search size={16} className="shrink-0" />
          <span className="truncate">Titre, auteur, librairie...</span>
        </div>

        <button onClick={() => setMenuOuvert(true)} className="lg:hidden ml-auto w-9 h-9 rounded-full bg-surfaceAlt flex items-center justify-center shrink-0">
          <Menu size={18} />
        </button>

        <div className="hidden lg:flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/compte/envies" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surfaceAlt">
            <Heart size={17} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">4</span>
          </Link>
          <Link to="/panier" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surfaceAlt">
            <ShoppingCart size={17} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </Link>
          <Link to="/login" className="btn-accent btn-sm">Connexion / S'inscrire</Link>
        </div>
      </div>

      {/* Menu plein écran mobile */}
      {menuOuvert && (
        <div className="fixed inset-0 z-50 bg-surface lg:hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="font-head text-lg font-bold"><span className="text-ink">Book</span><span className="text-accent">Space</span></span>
            <button onClick={() => setMenuOuvert(false)} className="w-9 h-9 rounded-full bg-surfaceAlt flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col p-5 gap-1 text-base font-semibold">
            {liens.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOuvert(false)} className="py-3 border-b border-border">
                {l.label}
              </NavLink>
            ))}
            <Link to="/compte/envies" onClick={() => setMenuOuvert(false)} className="py-3 border-b border-border flex items-center gap-2">
              <Heart size={17} /> Mes envies
            </Link>
            <Link to="/panier" onClick={() => setMenuOuvert(false)} className="py-3 border-b border-border flex items-center gap-2">
              <ShoppingCart size={17} /> Mon panier
            </Link>
            <Link to="/login" onClick={() => setMenuOuvert(false)} className="btn-accent justify-center mt-4">
              Connexion / S'inscrire
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
