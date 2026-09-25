import React, { useEffect, useState } from "react";
import { createAddress, fetchAddresses, updateAddress } from "../../lib/api";

const adresseVide = {
  label: "Domicile",
  name: "",
  phone: "",
  street: "",
  city: "",
  country: "",
  is_default: false,
};

// PAGE : Adresses de livraison (/compte/adresses)
export default function Adresses() {
  const [adresses, definirAdresses] = useState([]);
  const [formulaireOuvert, definirFormulaireOuvert] = useState(false);
  const [nouvelleAdresse, definirNouvelleAdresse] = useState(adresseVide);
  const [chargement, definirChargement] = useState(true);
  const [enregistrement, definirEnregistrement] = useState(false);
  const [erreur, definirErreur] = useState("");

  useEffect(() => {
    let actif = true;
    fetchAddresses()
      .then((resultat) => { if (actif) definirAdresses(resultat); })
      .catch((error) => { if (actif) definirErreur(error.message); })
      .finally(() => { if (actif) definirChargement(false); });

    return () => { actif = false; };
  }, []);

  async function enregistrerAdresse(event) {
    event.preventDefault();
    definirErreur("");
    definirEnregistrement(true);

    try {
      const enregistree = await createAddress({
        label: nouvelleAdresse.label,
        name: nouvelleAdresse.name,
        phone: nouvelleAdresse.phone || null,
        address: {
          street: nouvelleAdresse.street,
          city: nouvelleAdresse.city,
          country: nouvelleAdresse.country,
        },
        is_default: nouvelleAdresse.is_default || adresses.length === 0,
      });

      definirAdresses((courantes) => [
        ...courantes.map((adresse) => enregistree.is_default ? { ...adresse, is_default: false } : adresse),
        enregistree,
      ]);
      definirNouvelleAdresse(adresseVide);
      definirFormulaireOuvert(false);
    } catch (error) {
      definirErreur(error.message);
    } finally {
      definirEnregistrement(false);
    }
  }

  async function definirParDefaut(adresse) {
    definirErreur("");
    try {
      const miseAJour = await updateAddress(adresse.id_adresse, { is_default: true });
      definirAdresses((courantes) => courantes.map((courante) => ({
        ...courante,
        is_default: courante.id_adresse === miseAJour.id_adresse,
      })));
    } catch (error) {
      definirErreur(error.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="section-title">Adresses de livraison</div>
        <button type="button" onClick={() => definirFormulaireOuvert((ouvert) => !ouvert)} className="btn-primary btn-sm">
          {formulaireOuvert ? "Annuler" : "+ Ajouter une adresse"}
        </button>
      </div>

      {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}

      {formulaireOuvert && (
        <form onSubmit={enregistrerAdresse} className="card mb-5">
          <div className="card-title">Nouvelle adresse</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="adresse_libelle">Libellé</label>
              <input id="adresse_libelle" className="input" value={nouvelleAdresse.label} maxLength={100} required
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, label: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="adresse_nom">Nom du destinataire</label>
              <input id="adresse_nom" className="input" value={nouvelleAdresse.name} maxLength={255} required
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, name: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="adresse_telephone">Téléphone</label>
              <input id="adresse_telephone" className="input" type="tel" value={nouvelleAdresse.phone} maxLength={30}
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, phone: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="adresse_rue">Adresse</label>
              <input id="adresse_rue" className="input" value={nouvelleAdresse.street} required
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, street: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="adresse_ville">Ville</label>
              <input id="adresse_ville" className="input" value={nouvelleAdresse.city} required
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, city: event.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="adresse_pays">Pays</label>
              <input id="adresse_pays" className="input" value={nouvelleAdresse.country} required
                onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, country: event.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted mb-4">
            <input type="checkbox" checked={nouvelleAdresse.is_default}
              onChange={(event) => definirNouvelleAdresse({ ...nouvelleAdresse, is_default: event.target.checked })} />
            Définir comme adresse par défaut
          </label>
          <button type="submit" disabled={enregistrement} className="btn-primary btn-sm disabled:opacity-60">
            {enregistrement ? "Enregistrement…" : "Enregistrer l'adresse"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {chargement && <div className="text-muted text-sm">Chargement des adresses…</div>}
        {!chargement && !erreur && adresses.length === 0 && <div className="text-muted text-sm">Aucune adresse enregistrée.</div>}
        {adresses.map((adresse) => (
          <div key={adresse.id_adresse} className="card">
            <div className="flex justify-between items-start mb-3">
              <span className="pill-muted">{adresse.libelle}</span>
              {adresse.is_default && <span className="pill-success">Par défaut</span>}
            </div>
            <div className="font-bold text-sm mb-1">{adresse.nom_destinataire}</div>
            <div className="text-muted text-sm leading-relaxed mb-1">
              {adresse.adresse?.street}
              <br />
              {[adresse.adresse?.city, adresse.adresse?.country].filter(Boolean).join(", ")}
            </div>
            {adresse.tel_livraison && <div className="text-muted text-sm mb-4">{adresse.tel_livraison}</div>}
            {!adresse.is_default && (
              <button type="button" onClick={() => definirParDefaut(adresse)} className="btn-outline btn-sm mt-3">
                Définir par défaut
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
