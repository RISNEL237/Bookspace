import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSellerById } from "../../lib/api";
import { CarteLivreGrille } from "../../components/livres/CartesLivres";
import { FilAriane } from "../../components/ui/Composants";
import { Store, MapPin } from "lucide-react";

// PAGE : Vitrine publique d'un vendeur (/librairie/:id)
// Présente une librairie/éditeur et son catalogue.
export default function VitrineVendeur() {
  const { id } = useParams();
  const [vendeur, setVendeur] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchSellerById(id).then(setVendeur).catch((error) => setErreur(error.message));
  }, [id]);

  if (erreur) return <div className="px-4 sm:px-6 lg:px-10 py-10 text-danger">{erreur}</div>;
  if (!vendeur) return <div className="px-4 sm:px-6 lg:px-10 py-10 text-muted">Chargement de la librairie…</div>;

  const nomVendeur = vendeur.name;
  const livresVendeur = vendeur.books;

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Librairies partenaires", to: "/librairies" }, { label: nomVendeur }]} />

      <div className="px-4 sm:px-6 lg:px-10 pt-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 relative px-2 sm:px-4 py-5">
          <div className="flex-1 bg-surface sm:bg-transparent rounded-lg p-2">
            <div className="font-head text-xl sm:text-2xl font-extrabold">{nomVendeur}</div>
            <div className="text-muted text-sm flex items-center gap-1.5 mt-1"><MapPin size={13} /> {vendeur.city}, {vendeur.country}</div>
            {vendeur.description && <p className="text-muted text-sm mt-3">{vendeur.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {[
            [Store, String(livresVendeur.length), "Titres au catalogue"],
          ].map(([Icone, v, l]) => (
            <div key={l} className="card text-center !p-4">
              <Icone size={18} className="mx-auto text-accent mb-1.5" />
              <div className="font-head text-lg font-bold">{v}</div>
              <div className="text-faint text-[11px]">{l}</div>
            </div>
          ))}
        </div>

        <div className="section-title mb-4">Catalogue de la librairie</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-12">
          {livresVendeur.map((b) => (
            <CarteLivreGrille key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
