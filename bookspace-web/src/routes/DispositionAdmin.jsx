import React from "react";
import { Outlet } from "react-router-dom";
import { BarreNavigationPortail } from "../components/layout/BarreNavigationPortail";
import MenuLateral from "../components/layout/MenuLateral";

// Disposition de la console administrateur : barre de navigation
// + menu latéral admin + contenu de la page.
const links = [
  { to: "/admin", end: true, icon: "LayoutGrid", label: "Vue d'ensemble" },
  { to: "/admin/verification", icon: "ShieldCheck", label: "Vérification vendeurs", badge: "12" },
  { to: "/admin/moderation", icon: "Flag", label: "Modération & signalements", badge: "4" },
  { to: "/admin/commissions", icon: "%", label: "Commissions & règles" },
  { to: "/admin/logs", icon: "ScrollText", label: "Journaux de sécurité" },
];

export default function DispositionAdmin() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationPortail
        dark="bg-[#14201A]"
        portalName="Console d'administration"
        badge="Session sécurisée · Niveau 4"
        initials="SA"
      />
      <div className="flex flex-col lg:flex-row flex-1">
        <MenuLateral brand="Super-Admin" tag="Gouvernance plateforme" links={links} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
