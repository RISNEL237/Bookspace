import React, { useState } from "react";
import { Link } from "react-router-dom";
import { applyAsSeller } from "../../lib/api";
import { uploadPrivateFile } from "../../lib/storage";
import CarteSelectionLocalisation from "../../components/maps/CarteSelectionLocalisation";

export default function InscriptionVendeur() {
  const [form, setForm] = useState({ nom_commercial: "", type_de_structure: "boutique", numero_commercial: "", city: "", country: "Cameroun", latitude: null, longitude: null });
  const [pieceIdentite, setPieceIdentite] = useState(null);
  const [erreur, setErreur] = useState("");
  const [envoyee, setEnvoyee] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  function update(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  async function soumettre(event) {
    event.preventDefault(); setErreur(""); setEnvoi(true);
    try {
      const piece_identite = await uploadPrivateFile("seller-documents", pieceIdentite, { maxBytes: 15 * 1024 * 1024, allowedTypes: ["application/pdf", "image/jpeg", "image/png"] });
      await applyAsSeller({ nom_commercial: form.nom_commercial, type_de_structure: form.type_de_structure, numero_commercial: form.numero_commercial, city: form.city, country: form.country, latitude: form.latitude, longitude: form.longitude, piece_identite });
      setEnvoyee(true);
    } catch (error) { setErreur(error.message); } finally { setEnvoi(false); }
  }

  return <div className="min-h-screen bg-bg"><div className="bg-surface border-b border-border px-8 py-4"><Link to="/" className="font-head text-xl font-bold text-primary">BookSpace <span className="text-muted font-body text-sm font-medium">· Demande vendeur</span></Link></div>
    <div className="py-9 px-6"><div className="max-w-[760px] mx-auto"><div className="section-title mb-1.5">Demande d'inscription vendeur</div><div className="text-muted text-sm mb-7">Votre demande sera examinée par un administrateur avant l'activation de la boutique. Connectez-vous à votre compte avant l'envoi.</div>
      {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}{envoyee ? <div role="status" className="card text-success">Votre demande a été envoyée. La boutique reste inactive pendant la vérification.</div> : <form onSubmit={soumettre} className="card"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="field"><label htmlFor="commercial">Nom commercial</label><input id="commercial" className="input" value={form.nom_commercial} maxLength={255} onChange={(e) => update("nom_commercial", e.target.value)} required /></div>
        <div className="field"><label htmlFor="structure">Type de structure</label><select id="structure" className="input" value={form.type_de_structure} onChange={(e) => update("type_de_structure", e.target.value)}><option value="boutique">Boutique</option><option value="particulier">Particulier</option></select></div>
        <div className="field"><label htmlFor="numero-commercial">Numéro commercial (facultatif)</label><input id="numero-commercial" className="input" value={form.numero_commercial} maxLength={100} onChange={(e) => update("numero_commercial", e.target.value)} /></div>
        <div className="field"><label htmlFor="country">Pays</label><input id="country" className="input" value={form.country} maxLength={150} onChange={(e) => update("country", e.target.value)} required /></div>
        <div className="field"><label htmlFor="city">Ville</label><input id="city" className="input" value={form.city} maxLength={150} onChange={(e) => update("city", e.target.value)} required /></div>
        <div className="field sm:col-span-2"><label>Emplacement exact de la boutique</label><CarteSelectionLocalisation latitude={form.latitude} longitude={form.longitude} onChange={({ latitude, longitude }) => setForm((current) => ({ ...current, latitude, longitude }))} /><span className="text-faint text-xs">Coordonnées sélectionnées : {form.latitude != null ? `${form.latitude}, ${form.longitude}` : "aucun point choisi"}</span></div>
        <div className="field sm:col-span-2"><label htmlFor="identity">Justificatif d'identité (PDF, JPG ou PNG · 15 Mo max.)</label><input id="identity" className="input" type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setPieceIdentite(e.target.files?.[0] ?? null)} required /><span className="text-faint text-xs">Le document sera enregistré dans un espace privé.</span></div>
      </div><button type="submit" disabled={envoi || form.latitude == null || form.longitude == null} className="btn-primary mt-5 disabled:opacity-50">{envoi ? "Envoi…" : "Envoyer la demande"}</button></form>}
    </div></div>
  </div>;
}
