import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBookById } from "../../lib/api";
import { addToCart } from "../../lib/cart";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { Etoiles, FilAriane } from "../../components/ui/Composants";
import {
  Heart, BookOpen, Headphones, Store, MapPin, Star, Truck,
  ShieldCheck, ChevronRight, Smartphone, Check,
} from "lucide-react";

const onglets = ["Résumé & Synopsis", "Spécifications", "Avis Lecteurs"];

export default function FicheProduit() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [filtreFormat, setFiltreFormat] = useState("tous");
  const [onglet, definirOnglet] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetchBookById(id)
      .then(setBook)
      .catch(() => setBook(null));
  }, [id]);

  if (!book) {
    return (
      <div className="px-4 py-12 text-center text-muted">
        Chargement du livre…
      </div>
    );
  }

  const offres = book.offers.length > 0
    ? book.offers.map((offer) => ({
        id: offer.id,
        type: offer.type === "numerique" ? "numerique" : "papier",
        prix: offer.price,
        vendeur: offer.seller?.name || book.seller,
        ville: offer.seller?.city || book.sellerCity,
        sellerId: offer.sellerId || book.sellerId,
        note: book.rating,
        avis: book.reviews,
        delai: offer.type === "numerique" ? "Téléchargement immédiat" : "2 à 4 jours",
      }))
    : [
        {
          id: `${book.id}-paper`,
          type: "papier",
          prix: Number(book.pricePaper || 0),
          vendeur: book.seller,
          ville: book.sellerCity,
          sellerId: book.sellerId,
          note: book.rating,
          avis: book.reviews,
          delai: "2 à 4 jours",
        },
        {
          id: `${book.id}-ebook`,
          type: "numerique",
          prix: Number(book.priceEbook || 0),
          vendeur: book.seller,
          ville: book.sellerCity,
          sellerId: book.sellerId,
          note: book.rating,
          avis: book.reviews,
          delai: "Téléchargement immédiat",
        },
      ].filter((offre) => offre.prix > 0);

  const handleAddToCart = (offer) => {
    addToCart({
      id: book.id,
      offerId: offer.id,
      title: book.title,
      author: book.author,
      seller: offer.vendeur,
      sellerId: book.sellerId,
      format: offer.type === "papier" ? "Livre broché" : "E-pub / PDF",
      qty: 1,
      price: Number(offer.prix),
      shipping: offer.type === "papier" ? 3.5 : 0,
      cover: book.cover,
    });
  };

  const offresFiltrees = offres.filter((o) => filtreFormat === "tous" || o.type === filtreFormat);
  const meilleurPrix = Math.min(...offres.map((o) => o.prix));

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: book.genre, to: "/catalogue" }, { label: book.title }]} />

      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-10 pt-6">
        <div className="w-full lg:w-[300px] shrink-0">
          <div className="relative">
            <button className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
              <Heart size={16} />
            </button>
            <CouvertureLivre graine={book.id} cover={book.cover} className="w-full" ratio="3/4" />
          </div>
          <div className="flex gap-2.5 mt-3">
            <button className="btn-outline btn-sm flex-1 flex items-center justify-center gap-1.5"><BookOpen size={13} /> Extrait</button>
            <button className="btn-outline btn-sm flex-1 flex items-center justify-center gap-1.5"><Headphones size={13} /> Audio</button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="pill-muted">{book.genre?.toUpperCase()}</span>
          </div>
          <h1 className="font-head text-2xl sm:text-3xl font-extrabold mb-1.5">{book.title}</h1>
          <div className="text-muted text-sm mb-3">
            Auteur : <span className="text-accent-dark font-bold">{book.author}</span> · Parution {book.published}
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Etoiles rating={book.rating} /> <span className="text-faint text-xs">{book.reviews} avis vérifiés, tous vendeurs confondus</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="font-bold text-base flex items-center gap-2">
              <Store size={17} /> {offres.length} offre{offres.length > 1 ? "s" : ""} disponible{offres.length > 1 ? "s" : ""}
            </div>
            <div className="flex gap-2">
              {["tous", "papier", "numerique"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltreFormat(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${filtreFormat === f ? "bg-primary text-white" : "bg-surfaceAlt text-muted"}`}
                >
                  {f === "tous" ? "Tous formats" : f === "papier" ? "Papier" : "Numérique"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {offresFiltrees.map((o) => (
              <div key={o.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={o.type === "papier" ? "pill-warning" : "pill-info"}>
                      {o.type === "papier" ? <BookOpen size={11} className="inline mr-1" /> : <Smartphone size={11} className="inline mr-1" />}
                      {o.type === "papier" ? "Livre broché" : "ePub / PDF"}
                    </span>
                    {o.prix === meilleurPrix && <span className="pill-success flex items-center gap-1"><Check size={11} /> Meilleur prix</span>}
                  </div>
                  <div className="font-bold text-[15px]">{o.vendeur}</div>
                  <div className="text-muted text-xs flex items-center gap-3 flex-wrap mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {o.ville}</span>
                    <span className="flex items-center gap-1"><Star size={12} className="text-warning" /> {o.note} ({o.avis} avis)</span>
                    <span className="flex items-center gap-1"><Truck size={12} /> {o.delai}</span>
                  </div>
                  <Link to="/librairies" className="text-accent-dark text-[11.5px] font-bold flex items-center gap-1 mt-1.5 w-fit">
                    Voir sur la carte des librairies <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="font-head text-xl font-extrabold">{o.prix.toFixed(2)} €</div>
                  <button onClick={() => handleAddToCart(o)} className="btn-accent btn-sm">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card !p-3.5 mt-4 flex gap-2.5 items-start">
            <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" />
            <div className="text-xs text-muted">
              Chaque vendeur affiché est vérifié (KYB) par BookSpace.
              Comparez prix, délais et avis librement avant de choisir —
              votre paiement est réparti automatiquement et en toute
              transparence vers le vendeur sélectionné.
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-border mx-4 sm:mx-6 lg:mx-10 mt-9 text-sm overflow-x-auto">
        {onglets.map((t, i) => (
          <button key={t} onClick={() => definirOnglet(i)} className={`py-3 font-bold whitespace-nowrap ${i === onglet ? "text-ink border-b-2 border-accent" : "text-faint"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-7">
        {onglet === 0 && <p className="text-muted text-[13.5px] leading-relaxed max-w-[720px]">{book.synopsis}</p>}
        {onglet === 1 && (
          <div className="max-w-[420px] text-sm">
            {[["ISBN", book.isbn], ["Genre", book.genre], ["Pages", book.pages], ["Note moyenne", `${book.rating} / 5`]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border">
                <span className="text-muted">{k}</span><span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        )}
        {onglet === 2 && <div className="text-muted text-sm">{book.reviews} avis vérifiés — sélectionnez un vendeur ci-dessus pour consulter ses avis spécifiques.</div>}
      </div>
    </div>
  );
}
