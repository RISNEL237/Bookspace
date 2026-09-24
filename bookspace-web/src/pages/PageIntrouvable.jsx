import React from "react";
import { Link } from "react-router-dom";
import { livres } from "../lib/donnees";
import CouvertureLivre from "../components/ui/CouvertureLivre";
import { Home, Map, BookMarked, Search } from "lucide-react";

// PAGE : 404 - page introuvable (toute URL non reconnue)
export default function PageIntrouvable() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="max-w-[640px] mx-auto text-center">
        <div className="font-head text-7xl sm:text-8xl font-extrabold text-accent-pale mb-2">404</div>
        <div className="font-head text-2xl sm:text-3xl font-extrabold mb-3">Page égarée dans les rayonnages</div>
        <p className="text-muted text-sm mb-7">
          Le titre ou l'allée que vous cherchez semble avoir été déplacé,
          retiré des rayons, ou n'a jamais été imprimé. Ne vous laissez pas
          décourager par cette page blanche.
        </p>

        <div className="card !bg-surfaceAlt !border-none italic text-sm mb-7">
          « Il y a des livres dont le dos et la couverture sont de loin les
          meilleures parties. »
          <div className="not-italic text-faint text-xs mt-2">— Charles Dickens</div>
        </div>

        <div className="flex items-center gap-2.5 bg-surface border border-border rounded-full px-4 py-2.5 mb-6">
          <Search size={16} className="text-faint shrink-0" />
          <input placeholder="Rechercher un titre, un auteur, un rayon..." className="flex-1 outline-none bg-transparent text-sm" />
          <Link to="/catalogue" className="btn-accent btn-sm shrink-0">Explorer</Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/" className="btn-accent flex items-center justify-center gap-2"><Home size={16} /> Retourner à l'accueil</Link>
          <Link to="/librairies" className="btn-outline flex items-center justify-center gap-2"><Map size={16} /> Carte des librairies</Link>
          <Link to="/compte/bibliotheque" className="btn-outline flex items-center justify-center gap-2"><BookMarked size={16} /> Ma bibliothèque</Link>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto mt-14">
        <div className="section-title text-lg mb-4">Ne repartez pas les mains vides</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {livres.slice(0, 4).map((b) => (
            <Link key={b.id} to={`/livre/${b.id}`} className="card !p-0 overflow-hidden">
              <CouvertureLivre graine={b.id} className="rounded-none" />
              <div className="p-3">
                <div className="font-head font-bold text-[12.5px] leading-tight">{b.title}</div>
                <div className="text-faint text-[10.5px] mb-1.5">{b.author}</div>
                <b className="text-accent text-sm">{b.pricePaper.toFixed(2)} €</b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
