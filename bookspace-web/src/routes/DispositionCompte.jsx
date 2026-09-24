import React from "react";
import { Outlet } from "react-router-dom";
import BarreNavigationClient from "../components/layout/BarreNavigationClient";
import MenuLateral from "../components/layout/MenuLateral";
import { LayoutGrid, Package, BookMarked, Heart, MapPin, Settings } from "lucide-react";

// Disposition de l'espace "Mon compte" : barre de navigation
// + menu latéral du compte + contenu de la page.
const links = [
  { to: "/compte", end: true, icon: <LayoutGrid size={13} />, label: "Vue d'ensemble" },
  { to: "/compte/commandes", icon: <Package size={13} />, label: "Mes commandes" },
  { to: "/compte/bibliotheque", icon: <BookMarked size={13} />, label: "Ma bibliothèque numérique" },
  { to: "/compte/envies", icon: <Heart size={13} />, label: "Liste d'envies" },
  { to: "/compte/adresses", icon: <MapPin size={13} />, label: "Adresses & relais" },
  { to: "/compte/parametres", icon: <Settings size={13} />, label: "Préférences & sécurité" },
];

export default function DispositionCompte() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationClient />
      <div className="flex flex-col lg:flex-row flex-1">
        <MenuLateral
          brand="Éléonore de M."
          tag="Compte client · Certifié"
          links={links}
          footer={
            <div className="bg-surfaceAlt rounded p-4">
              <div className="text-sm font-bold">Conseiller dédié</div>
              <div className="text-faint text-sm mt-1">
                Librairie Le Silence de la Mer
              </div>
            </div>
          }
        />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
