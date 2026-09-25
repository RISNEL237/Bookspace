import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchChronicles } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

export default function CarnetsCritiques() {
  const [chroniques, setChroniques] = useState([]);
  const [erreur, setErreur] = useState("");
  useEffect(() => { fetchChronicles().then(setChroniques).catch((error) => setErreur(error.message)); }, []);

  return <div className="px-4 sm:px-6 lg:px-10 py-8">
    <div className="section-title mb-1">Les Carnets Critiques de <span className="text-accent">BookSpace</span></div>
    <div className="text-muted text-sm mb-8 max-w-[600px]">Chroniques et découvertes littéraires publiées par les libraires partenaires.</div>
    {erreur && <div role="alert" className="text-danger text-sm">{erreur}</div>}
    {!erreur && chroniques.length === 0 && <div className="text-muted text-sm">Aucune chronique publiée pour le moment.</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {chroniques.map((article) => <article key={article.id} className="card">
        {article.book && <Link to={`/livre/${article.book.id}`}><CouvertureLivre cover={article.image || article.book.cover} graine={article.book.id} className="mb-4" /></Link>}
        <h2 className="font-head font-bold text-lg">{article.title}</h2>
        {article.seller && <div className="text-faint text-xs mt-1">Par {article.seller}</div>}
        {article.published_at && <time className="text-faint text-xs">{new Date(article.published_at).toLocaleDateString("fr-FR")}</time>}
        {article.excerpt && <p className="text-muted text-sm mt-3">{article.excerpt}</p>}
      </article>)}
    </div>
  </div>;
}
