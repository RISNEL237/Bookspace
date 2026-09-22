import React from "react";
import { urlCouverture } from "../../lib/images";

// Couverture de livre : utilise une photo de substitution réaliste
// (voir lib/images.js) tant que les vraies couvertures du catalogue
// ne sont pas disponibles. "graine" = identifiant stable (id du livre)
// pour que la même couverture s'affiche à chaque fois.
export default function CouvertureLivre({ graine, cover, className = "", tag, ratio = "3/4" }) {
  const semence = graine || cover || "livre";
  return (
    <div className={`relative overflow-hidden rounded-lg bg-surfaceAlt shadow-md ${className}`} style={{ aspectRatio: ratio }}>
      <img
        src={urlCouverture(semence)}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {tag && (
        <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/60 text-white rounded px-1.5 py-0.5 z-10">
          {tag}
        </span>
      )}
    </div>
  );
}
