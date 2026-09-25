import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSellers } from "../../lib/api";
import { Search, Navigation, MapPin, Star, Clock, Map } from "lucide-react";

// PAGE : Carte des librairies (/librairies) — NOUVELLE PAGE
// Permet au client de localiser les libraires proposant une offre,
// en complément de la comparaison sur la fiche produit.
export default function CarteLibrairies() {
  const [recherche, setRecherche] = useState("Paris");
  const [librairies, setLibrairies] = useState([]);
  const [selection, setSelection] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchSellers()
      .then((vendeurs) => {
        setLibrairies(vendeurs);
        setSelection(vendeurs[0]?.id || "");
      })
      .catch((error) => setErreur(error.message));
  }, []);

  const librairiesFiltrees = librairies.filter((librairie) =>
    `${librairie.name} ${librairie.city} ${librairie.country}`.toLowerCase().includes(recherche.toLowerCase())
  );
  const librairieSelectionnee = librairies.find((librairie) => librairie.id === selection);

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
          {erreur && <div className="text-danger text-sm">{erreur}</div>}
          {!erreur && <div className="text-xs text-faint font-bold">{librairiesFiltrees.length} librairies trouvées</div>}
          {librairiesFiltrees.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelection(l.id)}
              className={`card w-full text-left !p-4 ${selection === l.id ? "border-accent bg-accent-pale" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-sm">{l.name}</div>
                <span className="pill-success shrink-0">Vendeur approuvé</span>
              </div>
              <div className="text-muted text-xs flex items-center gap-1.5 mt-1"><MapPin size={12} /> {l.city}, {l.country}</div>
              <div className="flex items-center gap-3 text-xs mt-2">
                <span className="flex items-center gap-1 text-warning"><Star size={12} fill="currentColor" /> {l.rating.toFixed(1)}</span>
                <span className="text-faint">{l.books.length} titres disponibles</span>
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
            Mapbox) — librairie sélectionnée : <b>{librairieSelectionnee?.name || "Aucune"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
