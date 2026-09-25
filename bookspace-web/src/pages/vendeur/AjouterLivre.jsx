import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSellerBook, fetchCategories } from "../../lib/api";
import { uploadPrivateFile } from "../../lib/storage";

const initial = { title: "", author: "", category_id: "", isbn: "", description: "", physical: true, paper_price: "", paper_stock: "", digital: false, digital_price: "", digital_file: "", rights_status: "", rights_proof: "" };

export default function AjouterLivre() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [ebookFile, setEbookFile] = useState(null);
  const [rightsProofFile, setRightsProofFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  useEffect(() => { fetchCategories().then(setCategories).catch((error) => setErreur(error.message)); }, []);

  function field(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  async function publier(event) {
    event.preventDefault(); setErreur(""); setEnvoi(true);
    try {
      const offers = [];
      const cover = coverFile ? await uploadPrivateFile("book-covers", coverFile, { maxBytes: 5 * 1024 * 1024, allowedTypes: ["image/jpeg", "image/png", "image/webp"], publicUrl: true }) : null;
      if (form.physical) offers.push({ type: "physique", price: Number(form.paper_price), stock: Number(form.paper_stock) });
      if (form.digital) {
        const digital_file = await uploadPrivateFile("digital-books", ebookFile, { maxBytes: 50 * 1024 * 1024, allowedTypes: ["application/pdf", "application/epub+zip"], allowedExtensions: ["epub"] });
        const rights_proof = rightsProofFile ? await uploadPrivateFile("seller-documents", rightsProofFile, { maxBytes: 15 * 1024 * 1024, allowedTypes: ["application/pdf", "image/jpeg", "image/png"] }) : null;
        offers.push({ type: "numerique", price: Number(form.digital_price), digital_file, rights_status: form.rights_status, rights_proof });
      }
      const book = await createSellerBook({ title: form.title, author: form.author, category_id: form.category_id || null, isbn: form.isbn || null, description: form.description || null, cover, offers });
      navigate(`/livre/${book.id}`);
    } catch (error) { setErreur(error.message); } finally { setEnvoi(false); }
  }

  return <form onSubmit={publier}><div className="flex justify-between items-start mb-6"><div><div className="section-title">Ajouter un ouvrage</div><div className="text-muted text-sm mt-1">Le catalogue et les prix seront enregistrés dans BookSpace.</div></div></div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="card mb-5"><div className="card-title">Informations du livre</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="field"><label htmlFor="titre">Titre</label><input id="titre" className="input" value={form.title} maxLength={255} onChange={(e) => field("title", e.target.value)} required /></div>
      <div className="field"><label htmlFor="auteur">Auteur</label><input id="auteur" className="input" value={form.author} maxLength={255} onChange={(e) => field("author", e.target.value)} required /></div>
      <div className="field"><label htmlFor="categorie">Catégorie</label><select id="categorie" className="input" value={form.category_id} onChange={(e) => field("category_id", e.target.value)}><option value="">Choisir une catégorie</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></div>
      <div className="field"><label htmlFor="isbn">ISBN</label><input id="isbn" className="input" value={form.isbn} maxLength={20} onChange={(e) => field("isbn", e.target.value)} /></div>
      <div className="field sm:col-span-2"><label htmlFor="cover">Couverture (JPG, PNG ou WebP · 5 Mo max.)</label><input id="cover" className="input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} /></div>      <div className="field sm:col-span-2"><label htmlFor="description">Description</label><textarea id="description" className="input" rows={4} value={form.description} maxLength={10000} onChange={(e) => field("description", e.target.value)} /></div>
    </div></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <section className="card"><label className="flex items-center gap-2 font-bold mb-4"><input type="checkbox" checked={form.physical} onChange={(e) => field("physical", e.target.checked)} />Offre physique</label>{form.physical && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="field"><label htmlFor="prix-papier">Prix (XAF)</label><input id="prix-papier" className="input" type="number" min="1" step="1" value={form.paper_price} onChange={(e) => field("paper_price", e.target.value)} required /></div><div className="field"><label htmlFor="stock">Stock</label><input id="stock" className="input" type="number" min="0" step="1" value={form.paper_stock} onChange={(e) => field("paper_stock", e.target.value)} required /></div></div>}</section>
      <section className="card"><label className="flex items-center gap-2 font-bold mb-4"><input type="checkbox" checked={form.digital} onChange={(e) => field("digital", e.target.checked)} />Offre numérique</label>{form.digital && <div className="space-y-3"><div className="field"><label htmlFor="prix-numerique">Prix (XAF)</label><input id="prix-numerique" className="input" type="number" min="1" step="1" value={form.digital_price} onChange={(e) => field("digital_price", e.target.value)} required /></div><div className="field"><label htmlFor="fichier">E-book (PDF ou EPUB · 50 Mo max.)</label><input id="fichier" className="input" type="file" accept="application/pdf,.epub,application/epub+zip" onChange={(e) => setEbookFile(e.target.files?.[0] ?? null)} required /></div><div className="field"><label htmlFor="droits">Statut des droits</label><select id="droits" className="input" value={form.rights_status} onChange={(e) => field("rights_status", e.target.value)} required><option value="">Choisir</option><option value="domaine_public">Domaine public</option><option value="droits_detenus">Droits détenus</option></select></div><div className="field"><label htmlFor="preuve">Justificatif des droits (facultatif · PDF, JPG ou PNG · 15 Mo max.)</label><input id="preuve" className="input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setRightsProofFile(e.target.files?.[0] ?? null)} /></div></div>}</section>
    </div>
    <button type="submit" disabled={envoi || (!form.physical && !form.digital)} className="btn-primary disabled:opacity-50">{envoi ? "Enregistrement…" : "Enregistrer les offres"}</button>
  </form>;
}
