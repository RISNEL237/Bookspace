import React from "react";
import { Link, NavLink } from "react-router-dom";
import Icone from "../ui/Icone";

// Barre de navigation du haut de page, visible sur tout l'espace client.
// Nouvelle direction visuelle : bandeau d'annonce orange au-dessus,
// logo bicolore (noir + orange), recherche pleine largeur.
export default function BarreNavigationClient() {
  return (
    <div>
      {/* Bandeau d'annonce */}
      <div className="bg-accent text-white text-center text-[11.5px] sm:text-[12.5px] font-semibold py-2 px-4">
        <span className="inline-flex items-center gap-1"><Icone name="Truck" size={14} /> Livraison offerte dès 35 € d'achats en librairie indépendante</span> · <span className="inline-flex items-center gap-1"><Icone name="BookOpen" size={14} /> Téléchargement ePub & PDF immédiat</span>
      </div>

      <div className="bg-surface border-b border-border px-4 sm:px-6 lg:px-10 py-3 lg:py-4 flex items-center gap-3 lg:gap-8">
        <Link to="/" className="font-head text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
          <span className="text-ink">Book</span>
          <span className="text-accent">Space</span>
        </Link>

        <div className="hidden lg:flex gap-6 text-sm font-semibold text-ink shrink-0">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "text-accent" : "hover:text-accent")}>
            Accueil
          </NavLink>
          <NavLink to="/catalogue" className={({ isActive }) => (isActive ? "text-accent" : "hover:text-accent")}>
            Catalogue
          </NavLink>
          <NavLink to="/catalogue?type=categories" className="hover:text-accent">
            Catégories
          </NavLink>
          <NavLink to="/librairies" className="hover:text-accent">
            Librairies Partenaires
          </NavLink>
        </div>

        {/* Recherche : masquée sur mobile, pleine largeur à partir de sm */}
        <div className="hidden sm:flex flex-1 items-center gap-2.5 bg-surfaceAlt border border-border rounded-full px-4.5 py-2.5 text-sm text-faint min-w-0">
          <Icone name="Search" size={17} />
          <span className="truncate">Titre, auteur, librairie...</span>
        </div>
        <Link to="/catalogue" className="sm:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-full bg-surfaceAlt shrink-0">
          <Icone name="Search" size={18} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/compte/envies" className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-surfaceAlt">
            <Icone name="Heart" size={18} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">4</span>
          </Link>
          <Link to="/panier" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surfaceAlt">
            <Icone name="ShoppingCart" size={18} />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </Link>
          <Link to="/login" className="btn-accent btn-sm hidden sm:inline-flex">
            Connexion / S'inscrire
          </Link>
          <Link to="/compte" className="sm:hidden w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            EM
          </Link>
        </div>
      </div>
    </div>
  );
}
