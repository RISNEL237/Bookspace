import React from "react";
import { livres } from "../../lib/donnees";
import { CarteLivreGrille } from "../../components/livres/CartesLivres";
import { FilAriane } from "../../components/ui/Composants";
import { HousePlus } from "lucide-react";

// PAGE : Vitrine publique d'un vendeur (/librairie/:id)
// Présente une librairie/éditeur et son catalogue.
export default function VitrineVendeur() {
  const sellerBooks = livres.filter((b) => b.seller === "Librairie Delamain");

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Librairies partenaires", to: "/catalogue" }, { label: "Librairie Delamain" }]} />
      <div className="px-10 pt-6">
        <div className="bg-primary rounded-lg p-8 text-white flex items-center gap-6">
          <div className="w-16 h-16 rounded-lg bg-white/15 flex items-center justify-center text-2xl"><HousePlus /></div>
          <div className="flex-1">
            <div className="font-head text-2xl font-bold">Librairie Delamain</div>
            <div className="text-white/70 text-sm mt-1">
              Paris 1er · Fondée en 1700 · ★ 4.9 (340 ventes)
            </div>
          </div>
          <button className="btn" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
            Suivre la librairie
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          {[
            ["86", "Titres au catalogue"],
            ["4.9 ★", "Note moyenne"],
            ["48h", "Délai d'expédition moyen"],
            ["1700", "Année de fondation"],
          ].map(([v, l]) => (
            <div key={l} className="card text-center">
              <div className="font-head text-xl font-bold text-primary">{v}</div>
              <div className="text-xs text-muted mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="section-title mb-4">Catalogue de la librairie</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pb-10">
          {sellerBooks.map((b) => (
            <CarteLivreGrille key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
