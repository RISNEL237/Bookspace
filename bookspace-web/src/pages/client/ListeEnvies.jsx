import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWishlist, removeFromWishlist } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

export default function ListeEnvies() {
  const [livres, setLivres] = useState([]);
  const [erreur, setErreur] = useState("");
  useEffect(() => { fetchWishlist().then(setLivres).catch((error) => setErreur(error.message)); }, []);

  async function retirer(id) {
    try {
      await removeFromWishlist(id);
      setLivres((courants) => courants.filter((livre) => livre.id !== id));
    } catch (error) { setErreur(error.message); }
  }

  return <div>
    <div className="section-title mb-1">Liste d'envies</div>
    <div className="text-muted text-sm mb-6">{livres.length} titre(s) enregistré(s).</div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    {!erreur && livres.length === 0 && <div className="text-muted text-sm">Votre liste d'envies est vide.</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {livres.map((livre) => <div key={livre.id} className="card flex gap-3">
        <CouvertureLivre cover={livre.cover} graine={livre.id} className="w-14 h-20 shrink-0" />
        <div className="min-w-0"><Link to={`/livre/${livre.id}`} className="font-bold">{livre.title}</Link><div className="text-muted text-sm">{livre.author}</div>
          <button type="button" onClick={() => retirer(livre.id)} className="btn-outline btn-sm mt-3">Retirer</button>
        </div>
      </div>)}
    </div>
  </div>;
}
