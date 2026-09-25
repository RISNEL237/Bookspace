import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { Etoiles } from "../../components/ui/Composants";
import { fetchBooks, fetchCategories, formatMoney } from "../../lib/api";
import { Store, BookOpenCheck, Building2 } from "lucide-react";

// PAGE : Accueil du site (/)
// Refonte visuelle 2026 : palette chaude orange, illustrations et
// photos réelles, badges flottants — direction "vitrine vivante"
// plutôt que "sobre éditorial" (retour suite aux retours reçus).
export default function Accueil() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch(() => setBooks([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const featuredBooks = books.slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 bg-surfaceAlt">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1">
            <h1 className="font-head text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.15] font-extrabold mb-4">
              Libérez Votre <span className="text-accent">Créativité</span> avec la Puissance d'un Livre.
            </h1>
            <p className="text-muted text-[15px] leading-relaxed mb-7 max-w-[480px]">
              Découvrez des livres proposés par des vendeurs indépendants et choisissez le format disponible qui vous convient.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/catalogue" className="btn-success text-center">
                <BookOpenCheck size={16} className="inline mr-1.5 -mt-0.5" /> Explorer le Catalogue
              </Link>
              <Link to="/vendeur/inscription" className="btn-outline text-center">
                <Building2 size={16} className="inline mr-1.5 -mt-0.5" /> Rejoindre en tant que libraire
              </Link>
            </div>
          </div>

          {books[0] && <div className="flex-1 w-full max-w-[300px]"><Link to={`/livre/${books[0].id}`}><CouvertureLivre graine={books[0].id} cover={books[0].cover} className="rounded-2xl shadow-lg" /></Link></div>}
        </div>
      </div>

      {/* RAYONS */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="section-title">Parcourir par Rayons</div>
            <div className="text-muted text-sm mt-1">Découvrez vos futurs coups de cœur littéraires</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/catalogue?categorie=${encodeURIComponent(category.slug)}`} className="card !p-4 text-center hover:shadow-pop transition-shadow">
              <div className="mb-2 flex justify-center text-accent"><Store size={22} /></div>
              <div className="font-bold text-[12.5px] leading-tight">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* COLLECTIONS POPULAIRES */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6">
          <div>
            <div className="section-title">Collections Populaires</div>
            <div className="text-muted text-sm mt-1">Sélectionnées avec passion par notre communauté de libraires</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {featuredBooks.map((b, i) => (
            <div key={b.id || i} className="card !p-0 overflow-hidden">
              <Link to={`/livre/${b.id}`}>
                <CouvertureLivre graine={b.id || i} cover={b.cover} className="rounded-none" />
              </Link>
              <div className="p-3.5">
                <Etoiles rating={b.rating} />
                <Link to={`/livre/${b.id}`} className="block font-head font-bold text-[13.5px] mt-1 hover:text-accent-dark leading-tight">
                  {b.title}
                </Link>
                <div className="text-faint text-[11px] mb-2">{b.author}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-faint text-[10px] block leading-none">dès</span>
                    <b className="text-accent font-head">{formatMoney(b.priceEbook || b.pricePaper)}</b>
                  </div>
                  <Link to={`/livre/${b.id}`} className="btn-success btn-sm flex items-center gap-1"><Store size={13} /> Offres</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/catalogue" className="btn-success">↻ Voir tout le catalogue</Link>
        </div>
      </div>

      {/* POURQUOI CHOISIR */}
      <div className="bg-surfaceAlt px-5 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="section-title mb-8">
          Pourquoi Choisir <span className="text-accent">BookSpace</span> ?
        </div>
      </div>
    </div>
  );
}
