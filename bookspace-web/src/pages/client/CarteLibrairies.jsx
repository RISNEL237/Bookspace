import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSellers } from "../../lib/api";
import CarteSelectionLocalisation from "../../components/maps/CarteSelectionLocalisation";
import { Search, MapPin, Star } from "lucide-react";

export default function CarteLibrairies() {
  const [recherche, setRecherche] = useState("");
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

  const librairiesFiltrees = useMemo(() => librairies.filter((librairie) =>
    `${librairie.name} ${librairie.city} ${librairie.country}`.toLowerCase().includes(recherche.toLowerCase())
  ), [librairies, recherche]);
  const vendeursCartographiables = useMemo(() => librairiesFiltrees
    .filter((seller) => Number.isFinite(seller.latitude) && Number.isFinite(seller.longitude))
    .map((seller) => ({ ...seller, onSelect: setSelection })), [librairiesFiltrees]);
  const librairieSelectionnee = librairies.find((librairie) => librairie.id === selection);

  return <div>
    <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-4">
      <div className="section-title">Trouvez votre librairie indépendante</div>
      <div className="text-muted text-sm mt-1 mb-4 max-w-[600px]">
        Consultez les librairies approuvées et leurs emplacements. Cliquez sur un repère pour afficher la boutique.
      </div>
      <div className="flex items-center gap-2.5 bg-surface border border-border rounded-full px-4 py-2.5 text-sm max-w-xl">
        <Search size={16} className="text-faint shrink-0" />
        <input value={recherche} onChange={(event) => setRecherche(event.target.value)} className="flex-1 outline-none bg-transparent" placeholder="Rechercher par nom ou ville" />
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 lg:px-10 pb-10">
      <div className="w-full lg:w-[380px] shrink-0 space-y-3">
        {erreur && <div role="alert" className="text-danger text-sm">{erreur}</div>}
        {!erreur && <div className="text-xs text-faint font-bold">{librairiesFiltrees.length} librairie(s) trouvée(s)</div>}
        {librairiesFiltrees.map((seller) => <article key={seller.id} className={`card !p-4 ${selection === seller.id ? "border-accent bg-accent-pale" : ""}`}>
          <button type="button" onClick={() => setSelection(seller.id)} className="w-full text-left">
            <div className="flex justify-between items-start gap-2"><span className="font-bold text-sm">{seller.name}</span><span className="pill-success shrink-0">Approuvée</span></div>
            <div className="text-muted text-xs flex items-center gap-1.5 mt-1"><MapPin size={12} /> {[seller.city, seller.country].filter(Boolean).join(", ") || "Localisation non renseignée"}</div>
            <div className="flex items-center gap-3 text-xs mt-2"><span className="flex items-center gap-1 text-warning"><Star size={12} fill="currentColor" /> {seller.rating.toFixed(1)}</span><span className="text-faint">{seller.books.length} titre(s) disponible(s)</span></div>
          </button>
          <Link to={`/librairie/${seller.id}`} className="text-accent-dark text-xs font-bold mt-2 inline-block">Voir la vitrine →</Link>
        </article>)}
        {!erreur && librairiesFiltrees.length > vendeursCartographiables.length && <p className="text-xs text-muted">{librairiesFiltrees.length - vendeursCartographiables.length} librairie(s) sans coordonnées ne peuvent pas encore apparaître sur la carte.</p>}
      </div>
      <div className="flex-1 min-h-[420px]">
        <CarteSelectionLocalisation vendeurs={vendeursCartographiables} selection={selection} hauteur={520} />
        {librairieSelectionnee && <div className="mt-2 text-sm text-muted">Sélection : <strong>{librairieSelectionnee.name}</strong> · {librairieSelectionnee.city}, {librairieSelectionnee.country}</div>}
      </div>
    </div>
  </div>;
}
