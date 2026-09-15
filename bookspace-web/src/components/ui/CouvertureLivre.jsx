import React from "react";
import { stylesCouvertures } from "../../lib/donnees";

// Petit composant réutilisable qui simule la couverture d'un livre
// (dégradé de couleur + titre + auteur), en l'absence de vraies images.
export default function CouvertureLivre({ cover = "cv1", title, author, className = "", tag }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[7px] bg-gradient-to-br ${stylesCouvertures[cover]} text-white flex flex-col justify-end p-2.5 shadow-md font-head ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 26px)",
        }}
      />
      {tag && (
        <span className="absolute top-2 left-2 text-[9px] font-bold bg-white/20 rounded px-1.5 py-0.5 z-10">
          {tag}
        </span>
      )}
      {title && (
        <div className="relative z-10 text-[12px] font-bold leading-tight">
          {title}
        </div>
      )}
      {author && (
        <div className="relative z-10 text-[9.5px] opacity-85 mt-1">{author}</div>
      )}
    </div>
  );
}
