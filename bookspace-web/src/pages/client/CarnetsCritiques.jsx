import React from "react";
import { Link } from "react-router-dom";
import { livres } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { urlPortrait } from "../../lib/images";
import { Mic, Send } from "lucide-react";

// PAGE : Carnets Critiques (/carnets-critiques) — NOUVELLE PAGE
// Magazine littéraire du réseau : chroniques rédigées par les
// libraires partenaires, entretiens d'auteurs.
export default function CarnetsCritiques() {
  const article = livres[0];
  const chroniques = livres.slice(1, 4);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="section-title mb-1">
        Les Carnets Critiques de <span className="text-accent">BookSpace</span>
      </div>
      <div className="text-muted text-sm mb-8 max-w-[600px]">
        La revue littéraire des libraires indépendants et des maisons
        d'édition partenaires : analyses, découvertes, entretiens.
      </div>

      {/* Article à la une */}
      <div className="card !p-0 overflow-hidden mb-10 flex flex-col md:flex-row">
        <div className="p-6 md:p-8 flex-1">
          <span className="pill-warning mb-3 inline-block">Dossier de fond</span>
          <div className="font-head text-xl sm:text-2xl font-extrabold leading-snug mb-3">
            Le retour en grâce du papier bouffant et de l'édition cousue
          </div>
          <div className="text-muted text-sm mb-4 leading-relaxed">
            « À l'heure de la saturation algorithmique, l'objet physique
            redevient un refuge ontologique. » Notre grand entretien avec
            les libraires du Collège Critique BookSpace sur ce retour de
            tendance vers les belles éditions.
          </div>
          <div className="flex items-center gap-2.5">
            <img src={urlPortrait("francois-caron", 60)} className="w-9 h-9 rounded-full object-cover" alt="" />
            <div className="text-xs">
              <div className="font-bold">François Caron</div>
              <div className="text-faint">Librairie Le Silence de la Mer</div>
            </div>
          </div>
        </div>
        <Link to={`/livre/${article.id}`} className="md:w-[240px] shrink-0">
          <CouvertureLivre graine={article.id} className="rounded-none h-full" ratio="4/5" />
        </Link>
      </div>

      {/* Chroniques */}
      <div className="section-title text-lg mb-4">Les Papillons Critiques du Mois</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {chroniques.map((b) => (
          <div key={b.id} className="card !p-0 overflow-hidden">
            <Link to={`/livre/${b.id}`}><CouvertureLivre graine={b.id} className="rounded-none" /></Link>
            <div className="p-4">
              <div className="font-head font-bold text-sm mb-2">{b.title}</div>
              <div className="text-muted text-[12.5px] leading-relaxed mb-3">
                {b.synopsis ? b.synopsis.slice(0, 90) + "…" : "Une chronique à découvrir par nos libraires partenaires."}
              </div>
              <Link to={`/livre/${b.id}`} className="text-accent-dark text-xs font-bold">Lire la chronique →</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Entretien audio */}
      <div className="bg-primary rounded-xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0">
          <Mic size={26} />
        </div>
        <div className="flex-1">
          <span className="text-accent text-xs font-bold">LE GRAND ENTRETIEN LITTÉRAIRE</span>
          <div className="font-head text-lg sm:text-xl font-bold mt-1">
            « Écrire, c'est ranimer la poussière des bibliothèques oubliées. »
          </div>
          <div className="text-white/60 text-xs mt-2">Madeleine de Varenne, autrice de « Les Mémoires de l'Ombre »</div>
        </div>
        <button className="btn bg-white text-primary shrink-0">▶ Écouter (24 min)</button>
      </div>

      {/* Newsletter */}
      <div className="card flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <div className="font-bold text-sm mb-1">La Lettre Critique Hebdomadaire</div>
          <div className="text-muted text-xs">Chaque vendredi, les coups de cœur des libraires — sans spam.</div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input placeholder="Votre e-mail" className="input flex-1 sm:w-56" />
          <button className="btn-accent flex items-center gap-1.5 shrink-0"><Send size={14} /> S'inscrire</button>
        </div>
      </div>
    </div>
  );
}
