import React from "react";
import { Link } from "react-router-dom";

// Composants d'interface réutilisés sur plusieurs pages :
// CarteIndicateur (chiffre clé), Etoiles (note), FilAriane (navigation), EnteteSection (titre de page).
export function CarteIndicateur({ label, value, delta, foot, tone = "" }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center text-[11.5px] font-bold uppercase tracking-wide text-faint mb-2.5">
        {label}
      </div>
      <div className={`font-head text-[28px] font-bold text-primary ${tone}`}>
        {value}
        {delta && (
          <span className="text-[12px] font-bold text-accent-dark ml-1.5">
            {delta}
          </span>
        )}
      </div>
      {foot && <div className="text-[12px] text-muted mt-2">{foot}</div>}
    </div>
  );
}

export function Etoiles({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="text-warning text-xs tracking-wide">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}{" "}
      <span className="text-faint tracking-normal">{rating}</span>
    </span>
  );
}

export function FilAriane({ items }) {
  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 text-[12.5px] text-faint flex gap-2 flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.to ? (
            <Link to={it.to} className="hover:text-primary">
              {it.label}
            </Link>
          ) : (
            <b className="text-muted font-semibold">{it.label}</b>
          )}
          {i < items.length - 1 && <span>›</span>}
        </span>
      ))}
    </div>
  );
}

export function EnteteSection({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-start mb-5 gap-4">
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="text-muted text-sm mt-1">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
