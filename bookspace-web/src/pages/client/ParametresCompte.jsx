import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { fetchMyProfile, updateMyProfile } from "../../lib/api";

// PAGE : Paramètres et sécurité du compte (/compte/parametres)
export default function ParametresCompte() {
  const [profil, setProfil] = useState({ nom_complet: "", tel_client: "", email: "" });
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");

  useEffect(() => {
    let actif = true;
    fetchMyProfile()
      .then((utilisateur) => {
        if (actif) setProfil({
          nom_complet: utilisateur.nom_complet || "",
          tel_client: utilisateur.tel_client || "",
          email: utilisateur.email || "",
        });
      })
      .catch((error) => { if (actif) setErreur(error.message); })
      .finally(() => { if (actif) setChargement(false); });

    return () => { actif = false; };
  }, []);

  async function enregistrerProfil(event) {
    event.preventDefault();
    setErreur("");
    setMessage("");
    setEnregistrement(true);

    try {
      const utilisateur = await updateMyProfile({
        nom_complet: profil.nom_complet,
        tel_client: profil.tel_client || null,
      });
      setProfil((courant) => ({ ...courant, ...utilisateur }));
      setMessage("Vos informations ont été enregistrées.");
    } catch (error) {
      setErreur(error.message);
    } finally {
      setEnregistrement(false);
    }
  }

  async function modifierMotDePasse(event) {
    event.preventDefault();
    setErreur("");
    setMessage("");

    if (nouveauMotDePasse.length < 8) {
      setErreur("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setErreur("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    setEnregistrement(true);
    try {
      const { error: connexionErreur } = await supabase.auth.signInWithPassword({
        email: profil.email,
        password: motDePasseActuel,
      });
      if (connexionErreur) throw new Error("Le mot de passe actuel est incorrect.");

      const { error: miseAJourErreur } = await supabase.auth.updateUser({ password: nouveauMotDePasse });
      if (miseAJourErreur) throw miseAJourErreur;

      setMotDePasseActuel("");
      setNouveauMotDePasse("");
      setConfirmationMotDePasse("");
      setMessage("Votre mot de passe a été modifié.");
    } catch (error) {
      setErreur(error.message || "Impossible de modifier le mot de passe.");
    } finally {
      setEnregistrement(false);
    }
  }

  return (
    <div>
      <div className="section-title mb-6">Préférences & sécurité</div>
      {erreur && <div role="alert" className="bg-danger-bg text-danger rounded-lg p-3 mb-4 text-sm">{erreur}</div>}
      {message && <div role="status" className="bg-success-bg text-success rounded-lg p-3 mb-4 text-sm">{message}</div>}

      <div className="max-w-3xl space-y-5">
        <form onSubmit={enregistrerProfil} className="card">
          <div className="card-title">Informations personnelles</div>
          {chargement ? <p className="text-muted text-sm">Chargement du profil…</p> : (
            <>
              <div className="field">
                <label htmlFor="nom_complet">Nom complet</label>
                <input id="nom_complet" className="input" value={profil.nom_complet}
                  onChange={(event) => setProfil({ ...profil, nom_complet: event.target.value })} maxLength={255} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="field">
                  <label htmlFor="email">Adresse e-mail</label>
                  <input id="email" type="email" className="input" value={profil.email} readOnly disabled />
                  <span className="text-faint text-xs">Gérée par votre compte Supabase Auth.</span>
                </div>
                <div className="field">
                  <label htmlFor="telephone">Téléphone</label>
                  <input id="telephone" type="tel" className="input" value={profil.tel_client}
                    onChange={(event) => setProfil({ ...profil, tel_client: event.target.value })} maxLength={30} />
                </div>
              </div>
              <button type="submit" disabled={chargement || enregistrement} className="btn-primary btn-sm disabled:opacity-60">
                {enregistrement ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
            </>
          )}
        </form>

        <form onSubmit={modifierMotDePasse} className="card">
          <div className="card-title flex items-center gap-2"><ShieldCheck size={16} /> Sécurité du compte</div>
          <div className="field">
            <label htmlFor="mot_de_passe_actuel">Mot de passe actuel</label>
            <input id="mot_de_passe_actuel" className="input" type="password" autoComplete="current-password"
              value={motDePasseActuel} onChange={(event) => setMotDePasseActuel(event.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="nouveau_mot_de_passe">Nouveau mot de passe</label>
              <input id="nouveau_mot_de_passe" className="input" type="password" autoComplete="new-password"
                minLength={8} value={nouveauMotDePasse} onChange={(event) => setNouveauMotDePasse(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="confirmation_mot_de_passe">Confirmer le mot de passe</label>
              <input id="confirmation_mot_de_passe" className="input" type="password" autoComplete="new-password"
                minLength={8} value={confirmationMotDePasse} onChange={(event) => setConfirmationMotDePasse(event.target.value)} required />
            </div>
          </div>
          <button type="submit" disabled={chargement || enregistrement} className="btn-outline btn-sm disabled:opacity-60">
            {enregistrement ? "Mise à jour…" : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
