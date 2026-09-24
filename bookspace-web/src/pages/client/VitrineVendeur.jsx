import React from "react";
import { useParams } from "react-router-dom";
import { livres } from "../../lib/donnees";
import { CarteLivreGrille } from "../../components/livres/CartesLivres";
import { FilAriane } from "../../components/ui/Composants";
import { urlPaysage, urlPortrait } from "../../lib/images";
import { Store, Clock, Truck, Percent, ShieldCheck, MapPin, Phone, Heart } from "lucide-react";

// PAGE : Vitrine publique d'un vendeur (/librairie/:id)
// Présente une librairie/éditeur et son catalogue.
export default function VitrineVendeur() {
  const { id } = useParams();
  const nomVendeur = "Librairie Delamain";
  const livresVendeur = livres.filter((b) => b.seller === nomVendeur || !id);

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Librairies partenaires", to: "/librairies" }, { label: nomVendeur }]} />

      <div className="px-4 sm:px-6 lg:px-10 pt-6">
        <div className="relative rounded-xl overflow-hidden h-40 sm:h-56">
          <img src={urlPaysage("librairie-delamain-facade", 1200, 400)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute top-3 left-3 pill-success">Ouvert actuellement</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 sm:-mt-12 relative px-2 sm:px-4">
          <img src={urlPortrait("librairie-delamain-logo", 110)} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-4 border-surface object-cover shrink-0" />
          <div className="flex-1 bg-surface sm:bg-transparent rounded-lg p-2">
            <div className="font-head text-xl sm:text-2xl font-extrabold">{nomVendeur}</div>
            <div className="text-muted text-sm flex items-center gap-1.5 mt-1"><MapPin size={13} /> 155 Rue Saint-Honoré, 75001 Paris</div>
          </div>
          <button className="btn-outline flex items-center gap-1.5"><Heart size={15} /> Suivre</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {[
            [Store, "412", "Titres au catalogue"],
            [Percent, "100%", "Marge locale reversée"],
            [Clock, "1700", "Année de fondation"],
            [ShieldCheck, "4.9★", "Note vérifiée"],
          ].map(([Icone, v, l]) => (
            <div key={l} className="card text-center !p-4">
              <Icone size={18} className="mx-auto text-accent mb-1.5" />
              <div className="font-head text-lg font-bold">{v}</div>
              <div className="text-faint text-[11px]">{l}</div>
            </div>
          ))}
        </div>

        <div className="card !bg-surfaceAlt !border-none flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
          <img src={urlPortrait("jean-benoit-lambert", 70)} className="w-14 h-14 rounded-full object-cover shrink-0" alt="" />
          <div className="flex-1 text-sm text-muted italic">
            « Depuis plus de trois siècles, nous perpétuons l'art de la
            découverte littéraire. Chaque commande soutient directement
            notre équipe de libraires passionnés. »
            <div className="not-italic font-bold text-ink mt-1.5">Jean-Benoît Lambert · Directeur</div>
          </div>
          <a href="tel:0142615019" className="btn-outline btn-sm shrink-0 flex items-center gap-1.5"><Phone size={13} /> Contacter</a>
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
