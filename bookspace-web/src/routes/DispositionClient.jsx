import React from "react";
import { Outlet } from "react-router-dom";
import BarreNavigationClient from "../components/layout/BarreNavigationClient";
import PiedDePageClient from "../components/layout/PiedDePageClient";

// Disposition (layout) des pages publiques : barre de navigation
// + contenu de la page + pied de page.
export default function DispositionClient() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <BarreNavigationClient />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <PiedDePageClient />
    </div>
  );
}
