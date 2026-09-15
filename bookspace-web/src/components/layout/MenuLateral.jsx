import React from "react";
import { NavLink } from "react-router-dom";

// Menu latéral générique (réutilisé pour le compte client,
// l'espace vendeur et la console administrateur) : reçoit la liste des liens en paramètre.
export default function MenuLateral({ brand, tag, links, footer }) {
  return (
    <div className="w-[264px] shrink-0 bg-surface border-r border-border p-6 flex flex-col gap-1">
      <div className="font-head text-xl font-bold text-primary mb-0.5">{brand}</div>
      <div className="text-[10.5px] tracking-wide uppercase text-faint mb-6 font-bold">
        {tag}
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
        >
          <span className="w-5 h-5 rounded-[5px] bg-surfaceAlt flex items-center justify-center text-[11px] shrink-0">
            {l.icon}
          </span>
          <span className="flex-1">{l.label}</span>
          {l.badge && <span className="pill-danger">{l.badge}</span>}
        </NavLink>
      ))}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
