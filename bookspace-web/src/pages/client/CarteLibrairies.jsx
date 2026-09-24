import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Navigation, MapPin, Star, Clock, Map } from "lucide-react";

// PAGE : Carte des librairies (/librairies) — NOUVELLE PAGE
// Permet au client de localiser les libraires proposant une offre,
// en complément de la comparaison sur la fiche produit.
const librairiesDemo = [
  { id: "delamain", nom: "Librairie Delamain", ville: "Paris 1er", adresse: "155 Rue Saint-Honoré, 75001", note: 4.9, avis: 340, titres: "14 200", ouverture: "Ouvert jusqu'à 19h30" },
  { id: "odeon", nom: "Librairie de l'Odéon", ville: "Paris 6e", adresse: "12 rue de l'Odéon, 75006", note: 4.7, avis: 210, titres: "9 850", ouverture: "Ouvert jusqu'à 20h00" },
  { id: "volcans", nom: "Librairie Les Volcans", ville: "Clermont-Ferrand", adresse: "80 boulevard François-Mitterrand", note: 4.9, avis: 890, titres: "45 000", ouverture: "Ferme à 19h00" },
  { id: "passages", nom: "Librairie Passages", ville: "Lyon 2e", adresse: "11 rue de Brest, 69002", note: 4.7, avis: 430, titres: "18 400", ouverture: "Ouvert jusqu'à 19h00" },
];

export default function CarteLibrairies() {
  const [recherche, setRecherche] = useState("Paris");
  const [selection, setSelection] = useState(librairiesDemo[0].id);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-4">
        <div className="section-title">Trouvez votre librairie indépendante de quartier</div>
        <div className="text-muted text-sm mt-1 mb-4 max-w-[560px]">
          Plus de 320 librairies fédérées sur BookSpace. Retirez vos
          commandes en Click & Collect ou faites-vous livrer directement
          depuis votre libraire préféré.
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 bg-surface border border-border rounded-full px-4 py-2.5 text-sm">
            <Search size={16} className="text-faint shrink-0" />
            <input value={recherche} onChange={(e) => setRecherche(e.target.value)} className="flex-1 outline-none bg-transparent" placeholder="Ville, code postal..." />
          </div>
          <button className="btn-outline flex items-center justify-center gap-1.5"><Navigation size={15} /> Me géolocaliser</button>
          <button className="btn-accent">Rechercher</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 lg:px-10 pb-10">
        <div className="w-full lg:w-[380px] shrink-0 space-y-3">
          <div className="text-xs text-faint font-bold">{librairiesDemo.length} librairies trouvées</div>
          {librairiesDemo.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelection(l.id)}
              className={`card w-full text-left !p-4 ${selection === l.id ? "border-accent bg-accent-pale" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-sm">{l.nom}</div>
                <span className="pill-success shrink-0">{l.ouverture}</span>
              </div>
              <div className="text-muted text-xs flex items-center gap-1.5 mt-1"><MapPin size={12} /> {l.adresse}, {l.ville}</div>
              <div className="flex items-center gap-3 text-xs mt-2">
                <span className="flex items-center gap-1 text-warning"><Star size={12} fill="currentColor" /> {l.note} ({l.avis})</span>
                <span className="text-faint">{l.titres} titres disponibles</span>
              </div>
              <Link to={`/librairie/${l.id}`} className="text-accent-dark text-xs font-bold mt-2 inline-block">Voir la vitrine →</Link>
            </button>
          ))}
        </div>

        {/* Emplacement carte (à brancher plus tard sur une vraie API de cartographie) */}
        <div className="flex-1 rounded-xl bg-surfaceAlt border border-dashed border-borderStrong min-h-[360px] lg:min-h-0 flex flex-col items-center justify-center text-center p-8">
          <Map size={40} className="text-faint mb-3" />
          <div className="font-bold text-sm mb-1">Carte interactive</div>
          <div className="text-muted text-xs max-w-[280px]">
            Emplacement réservé pour l'intégration d'une carte (Google Maps /
            Mapbox) — librairie sélectionnée : <b>{librairiesDemo.find((l) => l.id === selection)?.nom}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
