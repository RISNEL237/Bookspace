import Icone from "../../components/ui/Icone";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { livres } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { Etoiles, FilAriane } from "../../components/ui/Composants";

// PAGE : Fiche produit (/livre/:id)
// Détail d'un livre : choix du format, ajout au panier, avis.
export default function FicheProduit() {
  const { id } = useParams();
  const book = livres.find((b) => b.id === id) || livres[0];
  const [format, setFormat] = useState("paper");
  const [quantite, definirQuantite] = useState(1);

  return (
    <div>
      <FilAriane
        items={[
          { label: "Accueil", to: "/" },
          { label: book.genre, to: "/catalogue" },
          { label: book.title },
        ]}
      />
      <div className="flex flex-col md:flex-row gap-9 px-4 sm:px-6 lg:px-10 pt-7">
        <div className="w-full md:w-[340px] shrink-0">
          <CouvertureLivre cover={book.cover} title={book.title.toUpperCase()} author={book.author} className="h-[420px] rounded" />
          <div className="flex gap-2.5 mt-3.5">
            {[0, 1, 2].map((i) => (
              <CouvertureLivre key={i} cover={book.cover} className={`w-14 h-14 ${i === 0 ? "ring-2 ring-primary" : "ring-2 ring-border"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <span className="pill-info mb-3 inline-block">Notice critique certifiée</span>
          <h1 className="font-head text-3xl font-bold mb-1.5">{book.title}</h1>
          <div className="text-muted text-sm mb-4">
            Par <b className="text-primary">{book.author}</b> · <Etoiles rating={book.rating} /> ({book.reviews} avis) · Parution {book.published} · {book.pages} pages
          </div>

          <div className="flex gap-3 my-5">
            <button
              onClick={() => setFormat("paper")}
              className={`flex-1 text-left border-[1.5px] rounded p-4 ${format === "paper" ? "border-primary bg-primary-pale" : "border-borderStrong"}`}
            >
              <div className="text-xs text-muted font-bold uppercase mb-1.5"><span className="inline-flex items-center gap-1.5"><Icone name="BookOpen" size={15} /> Livre broché</span></div>
              <div className="font-head text-[22px] font-bold text-primary">{book.pricePaper.toFixed(2)} €</div>
              <div className="text-muted text-xs mt-1.5">Prix unique garanti — Loi Lang</div>
            </button>
            <button
              onClick={() => setFormat("ebook")}
              className={`flex-1 text-left border-[1.5px] rounded p-4 ${format === "ebook" ? "border-primary bg-primary-pale" : "border-borderStrong"}`}
            >
              <div className="text-xs text-muted font-bold uppercase mb-1.5"><span className="inline-flex items-center gap-1.5"><Icone name="Download" size={15} /> E-pub / PDF</span></div>
              <div className="font-head text-[22px] font-bold text-primary">{book.priceEbook.toFixed(2)} €</div>
              <div className="text-muted text-xs mt-1.5">Téléchargement immédiat</div>
            </button>
          </div>

          <div className="bg-surfaceAlt rounded p-4 flex items-center gap-3.5 my-4.5">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-primary text-white flex items-center justify-center shrink-0"><Icone name="Store" size={19} /></div>
            <div className="flex-1">
              <div className="font-bold text-sm">Vendu et expédié par {book.seller}</div>
              <div className="text-faint text-xs"><span className="inline-flex items-center gap-1">{book.sellerCity} · <Icone name="Star" size={12} /> {book.rating} ({book.reviews} ventes)</span></div>
            </div>
            <span className="pill-success">En stock</span>
          </div>

          <div className="flex items-center gap-4 my-5">
            <div className="flex items-center border border-borderStrong rounded-[8px] overflow-hidden text-sm">
              <button onClick={() => definirQuantite(Math.max(1, quantite - 1))} className="w-[34px] h-[34px] font-bold text-muted">–</button>
              <span className="w-9 text-center font-bold">{quantite}</span>
              <button onClick={() => definirQuantite(quantite + 1)} className="w-[34px] h-[34px] font-bold text-muted">+</button>
            </div>
            <button className="btn-primary flex-1">
              <span className="inline-flex items-center justify-center gap-2"><Icone name="ShoppingBag" size={16} /> Ajouter au panier — {(format === "paper" ? book.pricePaper : book.priceEbook).toFixed(2)} €</span>
            </button>
            <button className="btn-outline"><Icone name="Heart" size={18} /></button>
          </div>
          <div className="text-sm text-muted">
            <span className="inline-flex items-center gap-1.5"><Icone name="Truck" size={15} /> Livraison à domicile sous 48h ou retrait gratuit en librairie · <Icone name="Lock" size={15} /> Paiement sécurisé</span>
          </div>
        </div>
      </div>

      <div className="flex gap-7 border-b border-border mx-10 mt-9 text-sm">
        {["Résumé de l'œuvre", "Spécifications", `Avis (${book.reviews})`, "L'autrice"].map((t, i) => (
          <div key={t} className={`py-3 font-bold ${i === 0 ? "text-primary border-b-2 border-accent" : "text-faint"}`}>
            {t}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-10 py-7">
        <div className="flex-[1.4]">
          <p className="text-muted text-[13.5px] leading-relaxed">{book.synopsis}</p>
          <div className="mt-6">
            <div className="section-title text-base mb-3">Livres du même auteur</div>
            <div className="flex gap-4 flex-wrap">
              {livres.filter((b) => b.author === book.author && b.id !== book.id).map((b) => (
                <Link key={b.id} to={`/livre/${b.id}`} className="text-sm font-bold text-accent-dark">
                  {b.title} →
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[320px] shrink-0">
          <div className="card">
            <div className="card-title">Spécifications</div>
            {[
              ["ISBN-13", book.isbn],
              ["Éditeur", "Actes Littéraires"],
              ["Genre", book.genre],
              ["Pagination", `${book.pages} pages`],
              ["Gestion des droits", "DRM social"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border text-[12.5px] last:border-b-0">
                <span className="text-muted">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
