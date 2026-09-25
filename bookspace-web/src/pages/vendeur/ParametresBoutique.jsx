import React, { useEffect, useState } from "react";
import { fetchSellerProfile, updateSellerProfile } from "../../lib/api";
import CarteSelectionLocalisation from "../../components/maps/CarteSelectionLocalisation";

export default function ParametresBoutique() {
  const [boutique, setBoutique] = useState({ shop_name: "", description: "", city: "", country: "", latitude: null, longitude: null });
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSellerProfile().then((seller) => setBoutique({ shop_name: seller.shop_name || "", description: seller.description || "", city: seller.city || "", country: seller.country || "", latitude: seller.latitude ?? null, longitude: seller.longitude ?? null }))
      .catch((error) => setErreur(error.message)).finally(() => setChargement(false));
  }, []);

  async function enregistrer(event) {
    event.preventDefault(); setErreur(""); setMessage(""); setEnregistrement(true);
    try {
      const seller = await updateSellerProfile({ nom_commercial: boutique.shop_name, description_boutique: boutique.description, localisation: { city: boutique.city, country: boutique.country, latitude: boutique.latitude, longitude: boutique.longitude } });
      setBoutique({ shop_name: seller.shop_name || "", description: seller.description || "", city: seller.city || "", country: seller.country || "", latitude: seller.latitude ?? null, longitude: seller.longitude ?? null });
      setMessage("Les informations de la boutique ont été enregistrées.");
    } catch (error) { setErreur(error.message); } finally { setEnregistrement(false); }
  }

  return <div><div className="section-title mb-6">Paramètres boutique</div>{erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}{message && <div role="status" className="text-success text-sm mb-4">{message}</div>}
    <form onSubmit={enregistrer} className="card max-w-3xl"><div className="card-title">Informations de la boutique</div>{chargement ? <div className="text-muted text-sm">Chargement…</div> : <>
      <div className="field"><label htmlFor="nom-boutique">Nom commercial</label><input id="nom-boutique" className="input" value={boutique.shop_name} maxLength={255} required onChange={(event) => setBoutique({ ...boutique, shop_name: event.target.value })} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="field"><label htmlFor="ville-boutique">Ville</label><input id="ville-boutique" className="input" value={boutique.city} maxLength={150} onChange={(event) => setBoutique({ ...boutique, city: event.target.value })} /></div><div className="field"><label htmlFor="pays-boutique">Pays</label><input id="pays-boutique" className="input" value={boutique.country} maxLength={150} onChange={(event) => setBoutique({ ...boutique, country: event.target.value })} /></div></div>
      <div className="field"><label>Emplacement exact de la boutique</label><CarteSelectionLocalisation latitude={boutique.latitude} longitude={boutique.longitude} onChange={({ latitude, longitude }) => setBoutique((current) => ({ ...current, latitude, longitude }))} /><span className="text-faint text-xs">Coordonnées : {boutique.latitude != null ? `${boutique.latitude}, ${boutique.longitude}` : "aucun point choisi"}</span></div>
      <div className="field"><label htmlFor="description-boutique">Description publique</label><textarea id="description-boutique" className="input" rows={4} maxLength={5000} value={boutique.description} onChange={(event) => setBoutique({ ...boutique, description: event.target.value })} /></div>
      <button type="submit" disabled={enregistrement} className="btn-primary btn-sm disabled:opacity-60">{enregistrement ? "Enregistrement…" : "Enregistrer"}</button>
    </>}</form>
  </div>;
}
