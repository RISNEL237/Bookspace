import React from "react";
import { Link } from "react-router-dom";

// Barre de navigation du haut de page pour les portails vendeur
// et administrateur (fond foncé, badge de statut).
export function BarreNavigationPortail({ dark = "bg-primary", portalName, badge, initials }) {
  return (
    <div className={`${dark} px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center gap-2`}>
      <Link to="/" className="font-head text-white text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-white inline-block shrink-0" />
        <span className="shrink-0">BookSpace</span>
        <span className="hidden sm:inline font-body text-white/60 font-medium text-sm ml-1.5 truncate">
          {portalName}
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-2 sm:gap-4 shrink-0">
        {badge && (
          <span className="pill hidden md:inline-flex" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
            {badge}
          </span>
        )}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-primary flex items-center justify-center text-xs sm:text-[13px] font-bold shrink-0">
          {initials}
        </div>
      </div>
    </div>
  );
}
