import { Download } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { fetchDigitalBookDownloadLink, fetchDigitalLibrary } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Bibliothèque numérique (/compte/bibliotheque)
// Liste des e-books déjà achetés, prêts au téléchargement.
export default function BibliothequeNumerique() {
  const [livres, definirLivres] = useState([]);
  const [recherche, definirRecherche] = useState("");
  const [erreur, definirErreur] = useState("");
  const [telechargement, definirTelechargement] = useState(null);

  useEffect(() => {
    fetchDigitalLibrary()
      .then(definirLivres)
      .catch((error) => definirErreur(error.message));
  }, []);

  const livresFiltres = useMemo(
    () => livres.filter((livre) => `${livre.title} ${livre.author}`.toLowerCase().includes(recherche.toLowerCase())),
    [livres, recherche]
  );

  async function telecharger(id) {
    definirErreur("");
    definirTelechargement(id);
    try {
      const { url } = await fetchDigitalBookDownloadLink(id);
      window.location.assign(url);
    } catch (error) {
      definirErreur(error.message);
    } finally {
      definirTelechargement(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="section-title">Ma bibliothèque numérique</div>
          <div className="text-muted text-sm mt-1">
            Retrouvez l'ensemble de vos acquisitions numériques prêtes au
            téléchargement et synchronisées.
          </div>
        </div>
      </div>

      <div className="flex gap-3 my-5">
        <input value={recherche} onChange={(event) => definirRecherche(event.target.value)} className="input flex-1" placeholder="Rechercher dans mes livres..." />
        <select className="input w-auto">
          <option>Tous les formats</option>
          <option>ePub</option>
          <option>PDF</option>
        </select>
        <select className="input w-auto">
          <option>Récemment achetés</option>
          <option>Titre A-Z</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4 w-full">
          {erreur && <div className="text-danger text-sm">{erreur}</div>}
          {!erreur && livresFiltres.length === 0 && <div className="text-muted text-sm">Aucun livre numérique disponible.</div>}
          {livresFiltres.map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded p-4 flex gap-4">
              <CouvertureLivre graine={b.id} cover={b.cover} className="w-14 h-20 shrink-0" tag={b.format} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="pill-muted mb-1.5 inline-block">{b.seller}</span>
                    <div className="font-head font-bold">{b.title}</div>
                    <div className="text-muted text-sm">{b.author}</div>
                  </div>
                  <span className="pill-success">Prêt</span>
                </div>
                <div className="text-faint text-xs mt-1.5 mb-3">
                  Acheté le {b.purchased ? new Date(b.purchased).toLocaleDateString("fr-FR") : "-"} · Format {b.format}
                </div>
                <div className="flex gap-2.5">
                  <button type="button" disabled={!b.download_available || telechargement === b.id} onClick={() => telecharger(b.id)} className="btn-primary btn-sm disabled:opacity-50"><Download size={13} className="inline mr-1"/> {telechargement === b.id ? "Préparation du lien…" : b.download_available ? "Télécharger" : "Téléchargement indisponible"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[320px] shrink-0 space-y-5">
          <div className="card">
            <div className="card-title">Accès aux fichiers</div>
            <div className="text-muted text-sm">
              Chaque demande est vérifiée côté serveur et reçoit un lien temporaire. Le bucket de stockage doit rester privé.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
