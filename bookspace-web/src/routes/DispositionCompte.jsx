import React from "react";
import { Outlet } from "react-router-dom";
import BarreNavigationClient from "../components/layout/BarreNavigationClient";
import MenuLateral from "../components/layout/MenuLateral";
import { FolderIcon, Heart, LayoutGrid, MapPin, Settings, ShoppingBag } from "lucide-react";

// Disposition de l'espace "Mon compte" : barre de navigation
// + menu latéral du compte + contenu de la page.
const links = [
  { to: "/compte", end: true, icon: <><LayoutGrid /></>, label: "Vue d'ensemble" },
  { to: "/compte/commandes", icon: <><ShoppingBag /></>, label: "Mes commandes" },
  { to: "/compte/bibliotheque", icon: <><FolderIcon /></>, label: "Ma bibliothèque numérique" },
  { to: "/compte/envies", icon: <><Heart /></>, label: "Liste d'envies" },
  { to: "/compte/adresses", icon: <><MapPin /></>, label: "Adresses & relais" },
  { to: "/compte/parametres", icon: <><Settings /></>, label: "Préférences & sécurité" },
];

export default function DispositionCompte() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationClient />
      <div className="flex flex-1">
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
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
