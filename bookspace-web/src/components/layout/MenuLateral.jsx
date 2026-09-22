import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icone from "../ui/Icone";

// Menu latéral générique (réutilisé pour le compte client,
// l'espace vendeur et la console administrateur) : reçoit la liste des liens en paramètre.
//
// Responsive : en dessous de "lg" (1024px), la sidebar fixe disparaît
// et devient un tiroir (drawer) qui s'ouvre par-dessus la page via un
// bouton "Menu". Au-dessus de "lg", comportement classique inchangé.
export default function MenuLateral({ brand, tag, links, footer }) {
  const [ouvert, setOuvert] = useState(false);

  const contenu = (
    <>
      <div className="font-head text-xl font-bold text-primary mb-0.5">{brand}</div>
      <div className="text-[10.5px] tracking-wide uppercase text-faint mb-6 font-bold">
        {tag}
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setOuvert(false)}
          className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
        >
          <span className="w-5 h-5 rounded-[5px] bg-surfaceAlt flex items-center justify-center text-[11px] shrink-0">
            <Icone name={l.icon} size={15} />
          </span>
          <span className="flex-1">{l.label}</span>
          {l.badge && <span className="pill-danger">{l.badge}</span>}
        </NavLink>
      ))}
      {footer && <div className="mt-4">{footer}</div>}
    </>
  );

  return (
    <>
      {/* Barre "Menu" : uniquement visible sous lg (mobile/tablette) */}
      <div className="lg:hidden bg-surface border-b border-border px-4 py-2.5 w-full">
        <button
          onClick={() => setOuvert(true)}
          className="flex items-center gap-2 text-sm font-bold text-primary"
        >
          <Icone name="Menu" size={19} /> Menu
        </button>
      </div>

      {/* Sidebar classique, fixe : uniquement à partir de lg */}
      <div className="hidden lg:flex w-[264px] shrink-0 bg-surface border-r border-border p-6 flex-col gap-1">
        {contenu}
      </div>

      {/* Tiroir mobile : par-dessus tout, avec fond assombri cliquable pour fermer */}
      {ouvert && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-[82%] max-w-[300px] h-full bg-surface p-6 flex flex-col gap-1 overflow-y-auto shadow-pop">
            <button
              onClick={() => setOuvert(false)}
              className="self-end text-2xl leading-none text-muted mb-3"
              aria-label="Fermer le menu"
            >
              <Icone name="X" size={22} />
            </button>
            {contenu}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOuvert(false)} />
        </div>
      )}
    </>
  );
}
