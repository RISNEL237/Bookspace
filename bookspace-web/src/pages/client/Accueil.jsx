import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { urlPaysage, urlPortrait } from "../../lib/images";
import { Etoiles } from "../../components/ui/Composants";
import { fetchBooks } from "../../lib/api";
import { Store, Award, Zap, Scale, GraduationCap, Landmark, Palette, Baby, Microscope, Image as ImageIcon, PartyPopper, BookOpenCheck, Building2 } from "lucide-react";

// PAGE : Accueil du site (/)
// Refonte visuelle 2026 : palette chaude orange, illustrations et
// photos réelles, badges flottants — direction "vitrine vivante"
// plutôt que "sobre éditorial" (retour suite aux retours reçus).
const rayons = [
  { icon: <Landmark size={22} />, nom: "Romans & Fiction", total: "14 200 titres" },
  { icon: <Palette size={22} />, nom: "BD & Mangas", total: "8 900 titres" },
  { icon: <Award size={22} />, nom: "Histoire & Essais", total: "6 400 titres" },
  { icon: <Microscope size={22} />, nom: "Sciences & Savoirs", total: "5 100 titres" },
  { icon: <Baby size={22} />, nom: "Jeunesse & Éveil", total: "7 300 titres" },
  { icon: <ImageIcon size={22} />, nom: "Beaux Livres & Art", total: "2 600 titres" },
];

const libraires = [
  { nom: "Jean-Marc Valette", role: "Libraire indépendant, Paris" },
  { nom: "David Rochefort", role: "Éditeur & Auteur indépendant" },
  { nom: "Clémence Leroux", role: "Libraire de l'Odéon, Paris" },
];

export default function Accueil() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch(() => setBooks([]));
  }, []);

  const featuredBooks = books.slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 bg-surfaceAlt">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-accent-pale text-accent-dark text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
              ★ 4.9/5 · 2100+ avis lecteurs certifiés
            </div>
            <h1 className="font-head text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.15] font-extrabold mb-4">
              Libérez Votre <span className="text-accent">Créativité</span> avec la Puissance d'un Livre.
            </h1>
            <p className="text-muted text-[15px] leading-relaxed mb-7 max-w-[480px]">
              La première place de marché hybride : commandez vos livres
              papier auprès des librairies indépendantes de quartier ou
              téléchargez instantanément vos ePubs et PDFs protégés.
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

          <div className="flex-1 relative w-full max-w-[440px]">
            <img
              src={urlPaysage("etagere-livres-bookspace", 700, 460)}
              alt="Étagère de livres"
              className="w-full rounded-2xl shadow-lg object-cover"
            />
            <div className="absolute -top-4 left-4 bg-surface rounded-xl shadow-md px-4 py-2.5 flex items-center gap-2.5">
              <Building2 size={18} />
              <div>
                <div className="text-[10px] text-faint">dès</div>
                <div className="font-head text-sm font-bold">2 Fictions Books</div>
              </div>
            </div>
            <div className="absolute -bottom-4 right-2 bg-surface rounded-xl shadow-md px-4 py-2.5">
              <div className="text-[10px] text-faint">100% Happy Readers</div>
              <div className="font-bold text-sm text-accent">10k Heureux Lecteurs</div>
            </div>
          </div>
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
          {rayons.map((r) => (
            <Link key={r.nom} to="/catalogue" className="card !p-4 text-center hover:shadow-pop transition-shadow">
              <div className="mb-2 flex justify-center text-accent">{r.icon}</div>
              <div className="font-bold text-[12.5px] leading-tight">{r.nom}</div>
              <div className="text-faint text-[11px] mt-0.5">{r.total}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* BANDEAU PROMO */}
      <div className="mx-5 sm:mx-10 lg:mx-16 rounded-2xl bg-gradient-to-r from-accent-pale to-warning-bg p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-accent-dark font-bold text-xs mb-2 flex items-center gap-1.5"><PartyPopper size={14} /> OFFRE LIMITÉE</div>
          <div className="font-head text-2xl sm:text-3xl font-extrabold mb-1">
            Livres jusqu'à <span className="text-accent">50%</span> de réduction !
          </div>
          <div className="text-muted text-sm">Ne manquez pas cette offre — sélection ePub et déstockage libraire.</div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/catalogue" className="btn-accent">Découvrir l'offre</Link>
        </div>
      </div>

      {/* COLLECTIONS POPULAIRES */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6">
          <div>
            <div className="section-title">Collections Populaires</div>
            <div className="text-muted text-sm mt-1">Sélectionnées avec passion par notre communauté de libraires</div>
          </div>
          <div className="flex gap-4 text-sm font-semibold text-faint">
            <span className="text-accent">Tous</span>
            <span>Fiction</span>
            <span>Histoire</span>
            <span>Thriller</span>
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
                    <b className="text-accent font-head">{Number(b.priceEbook || b.pricePaper || 0).toFixed(2)} €</b>
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
        <div className="card !p-6 sm:!p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shrink-0"><GraduationCap size={28} /></div>
          <div>
            <div className="font-head text-xl font-bold mb-1">
              Élevez votre esprit, <span className="text-success">lisez responsablement</span>
            </div>
            <div className="text-muted text-sm">
              Avec notre plateforme hybride, passez du format papier au
              numérique en toute liberté — sans jamais quitter votre librairie
              de quartier préférée.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            [<Store size={22} />, "Soutien aux Librairies Indépendantes", "100% de la marge papier reste chez votre libraire de quartier."],
            [<Zap size={22} />, "Lecture Numérique Instantanée", "Téléchargement immédiat, compatible toutes liseuses."],
            [<Scale size={22} />, "Prix Unique & Éthique (Loi Lang)", "Un prix juste, garanti identique partout."],
          ].map(([icon, titre, texte]) => (
            <div key={titre} className="card">
              <div className="mb-2.5 text-accent">{icon}</div>
              <div className="font-bold text-sm mb-1.5">{titre}</div>
              <div className="text-muted text-[12.5px]">{texte}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LIBRAIRES & AUTEURS */}
      <div className="px-5 sm:px-10 lg:px-16 py-10 sm:py-14 text-center">
        <div className="section-title mb-2">Rencontrez nos Libraires & Auteurs</div>
        <div className="text-muted text-sm mb-8 max-w-[520px] mx-auto">
          Les passeurs d'histoires qui animent BookSpace au quotidien et
          sélectionnent chaque jour les pépites de notre catalogue.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {libraires.map((l) => (
            <div key={l.nom} className="relative rounded-xl overflow-hidden group">
              <img src={urlPortrait(l.nom, 360)} alt={l.nom} className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left">
                <div className="text-white font-bold text-sm">{l.nom}</div>
                <div className="text-white/70 text-xs">{l.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
