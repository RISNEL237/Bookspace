import React from "react";
import { Outlet } from "react-router-dom";
import { BarreNavigationPortail } from "../components/layout/BarreNavigationPortail";
import MenuLateral from "../components/layout/MenuLateral";
import { LayoutGrid, BookOpen, Smartphone, Truck, Wallet, Settings } from "lucide-react";

// Disposition du portail vendeur : barre de navigation foncée
// + menu latéral vendeur + contenu de la page.
const links = [
  { to: "/vendeur", end: true, icon: <LayoutGrid size={13} />, label: "Vue d'ensemble" },
  { to: "/vendeur/livres-physiques", icon: <BookOpen size={13} />, label: "Mes livres physiques" },
  { to: "/vendeur/livres-numeriques", icon: <Smartphone size={13} />, label: "Mes livres numériques" },
  { to: "/vendeur/commandes", icon: <Truck size={13} />, label: "Commandes à expédier" },
  { to: "/vendeur/gains", icon: <Wallet size={13} />, label: "Gains & versements" },
  { to: "/vendeur/parametres", icon: <Settings size={13} />, label: "Paramètres boutique" },
];

export default function DispositionVendeur() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationPortail portalName="Portail Vendeur" initials="BS" />
      <div className="flex flex-col lg:flex-row flex-1">
        <MenuLateral brand="Ma boutique" tag="Espace vendeur" links={links} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
