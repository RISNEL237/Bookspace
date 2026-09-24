import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

// Barre de navigation du haut de page pour les portails vendeur
// et administrateur (fond foncé, badge de statut).
export function BarreNavigationPortail({ dark = "bg-primary", portalName, badge, initials }) {
  return (
    <div className={`${dark} px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center gap-2`}>
      <Link to="/" className="flex items-center gap-2 min-w-0">
        <img src="/logo-icon.png" alt="BookSpace" className="h-7 sm:h-8 w-auto shrink-0" />
        <span className="font-head text-white text-base sm:text-lg md:text-xl font-bold flex items-center gap-1 min-w-0">
          <span className="shrink-0">Book<span className="text-accent">Space</span></span>
          <span className="hidden sm:inline font-body text-white/60 font-medium text-sm ml-1.5 truncate">
            {portalName}
          </span>
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-2 sm:gap-4 shrink-0">
        {badge && (
          <span className="pill hidden md:inline-flex items-center gap-1.5" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
            <ShieldCheck size={12} /> {badge}
          </span>
        )}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent text-white flex items-center justify-center text-xs sm:text-[13px] font-bold shrink-0">
          {initials}
        </div>
      </div>
    </div>
  );
}
