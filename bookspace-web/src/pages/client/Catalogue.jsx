import React, { useState, useMemo, useEffect } from "react";
import { CarteLivreResultat } from "../../components/livres/CartesLivres";
import { FilAriane } from "../../components/ui/Composants";
import { fetchBooks } from "../../lib/api";
import { Search, SlidersHorizontal, X } from "lucide-react";

// PAGE : Catalogue (/catalogue)
// Liste des livres avec filtres réellement fonctionnels (format,
// recherche texte) et grille responsive.
const rayons = ["Tous", "Roman historique", "Roman contemporain", "Philosophie", "Poésie", "Essai"];

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [rayon, setRayon] = useState("Tous");
  const [formats, setFormats] = useState({ papier: true, numerique: true });
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks).catch(() => setBooks([]));
  }, []);

  const resultats = useMemo(() => {
    return books.filter((l) => {
      const matchTexte = (l.title + l.author).toLowerCase().includes(recherche.toLowerCase());
      const matchRayon = rayon === "Tous" || l.genre === rayon;
      const matchFormat =
        (formats.papier && Number(l.pricePaper ?? 0) > 0) ||
        (formats.numerique && Number(l.priceEbook ?? 0) > 0);

      return matchTexte && matchRayon && matchFormat;
    });
  }, [books, recherche, rayon, formats]);

  function basculerFormat(cle) {
    setFormats((f) => ({ ...f, [cle]: !f[cle] }));
  }

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Catalogue" }]} />

      <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-3">
        <div className="section-title">Catalogue & Sélections</div>
        <div className="text-muted text-sm mt-1">{resultats.length} ouvrages disponibles auprès de nos libraires partenaires</div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 flex gap-2.5 mb-4">
        <div className="flex-1 flex items-center gap-2.5 bg-surfaceAlt border border-border rounded-full px-4 py-2.5 text-sm">
          <Search size={16} className="text-faint shrink-0" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Titre, auteur..."
            className="flex-1 bg-transparent outline-none min-w-0"
          />
        </div>
        <button onClick={() => setFiltresOuverts((v) => !v)} className="lg:hidden btn-outline btn-sm shrink-0 flex items-center gap-1.5">
          <SlidersHorizontal size={14} /> Filtres
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-10 pb-10">
        <div className={`w-full lg:w-[240px] shrink-0 ${filtresOuverts ? "block" : "hidden"} lg:block`}>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-[11.5px] uppercase tracking-wide text-faint font-bold">Filtres</h5>
              <button onClick={() => setFiltresOuverts(false)} className="lg:hidden"><X size={16} /></button>
            </div>

            <div className="mb-5">
              <h6 className="text-xs font-bold mb-2.5">Format</h6>
              {[["papier", "Livre broché"], ["numerique", "E-pub / PDF"]].map(([cle, label]) => (
                <label key={cle} className="flex items-center justify-between text-sm text-muted py-1.5 cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    <input type="checkbox" checked={formats[cle]} onChange={() => basculerFormat(cle)} />
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <div className="mb-2">
              <h6 className="text-xs font-bold mb-2.5">Rayon</h6>
              {rayons.map((r) => (
                <button
                  key={r}
                  onClick={() => setRayon(r)}
                  className={`block w-full text-left text-sm py-1.5 ${rayon === r ? "text-accent font-bold" : "text-muted"}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button onClick={() => { setRecherche(""); setRayon("Tous"); setFormats({ papier: true, numerique: true }); }} className="btn-outline btn-sm w-full mt-4">
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="flex-1">
          {resultats.length === 0 ? (
            <div className="text-center py-16 text-muted">
              Aucun résultat pour ces critères — essayez d'élargir votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {resultats.map((b) => (
                <CarteLivreResultat key={b.id} book={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
