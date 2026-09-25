import React from "react";

export default function CouvertureLivre({ graine, cover, className = "", tag, ratio = "3/4" }) {
  const image = typeof cover === "string" && (/^https?:\/\//i.test(cover) || cover.startsWith("/")) ? cover : null;
  return (
    <div className={`relative overflow-hidden rounded-lg bg-surfaceAlt shadow-md ${className}`} style={{ aspectRatio: ratio }}>
      {image ? <img src={image} alt="Couverture du livre" className="w-full h-full object-cover" loading="lazy" /> : <div aria-hidden="true" className="w-full h-full bg-gradient-to-br from-surfaceAlt via-border to-surfaceAlt" />}
      {tag && (
        <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/60 text-white rounded px-1.5 py-0.5 z-10">
          {tag}
        </span>
      )}
    </div>
  );
}
