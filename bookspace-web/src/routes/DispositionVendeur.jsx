import React from "react";
import { Outlet } from "react-router-dom";
import { BarreNavigationPortail } from "../components/layout/BarreNavigationPortail";
import MenuLateral from "../components/layout/MenuLateral";

// Disposition du portail vendeur : barre de navigation foncée
// + menu latéral vendeur + contenu de la page.
const links = [
  { to: "/vendeur", end: true, icon: "LayoutGrid", label: "Vue d'ensemble" },
  { to: "/vendeur/livres-physiques", icon: "BookOpen", label: "Mes livres physiques" },
  { to: "/vendeur/livres-numeriques", icon: "Download", label: "Mes livres numériques" },
  { to: "/vendeur/commandes", icon: "Truck", label: "Commandes à expédier", badge: "4" },
  { to: "/vendeur/gains", icon: "CircleDollarSign", label: "Gains & versements" },
  { to: "/vendeur/parametres", icon: "Settings", label: "Paramètres boutique" },
];

export default function DispositionVendeur() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationPortail portalName="Portail Vendeur" badge="Compte vérifié Stripe Connect" initials="LD" />
      <div className="flex flex-col lg:flex-row flex-1">
        <MenuLateral brand="Librairie Delamain" tag="Boutique principale" links={links} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
