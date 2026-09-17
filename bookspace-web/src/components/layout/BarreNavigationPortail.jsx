import { BookOpen } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

// Barre de navigation du haut de page pour les portails vendeur
// et administrateur (fond foncé, badge de statut).
export function BarreNavigationPortail({ dark = "bg-primary", portalName, badge, initials }) {
  return (
    <div className={`${dark} px-8 py-4 flex items-center`}>
      <Link to="/" className="font-head text-white text-xl font-bold flex items-center gap-2">
        <BookOpen /> BookSpace
        <span className="font-body text-white/60 font-medium text-sm ml-1.5">
          {portalName}
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {badge && (
          <span className="pill" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
            {badge}
          </span>
        )}
        <div className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center text-[13px] font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}
