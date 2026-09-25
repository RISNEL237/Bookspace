import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { confirmationErrorMessage, emailConfirmationRedirectUrl, resendSignupConfirmation } from "../../lib/auth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Connexion() {
  const [onglet, setOnglet] = useState("connexion");
  const [voirMdp, setVoirMdp] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [information, setInformation] = useState("");
  const [confirmationNecessaire, setConfirmationNecessaire] = useState(false);
  const [renvoiConfirmationEnCours, setRenvoiConfirmationEnCours] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setOnglet("reinitialisation");
        setEmail(session?.user?.email || "");
        setMotDePasse("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function demanderReinitialisation() {
    setErreur("");
    setInformation("");
    if (!email) {
      setErreur("Saisissez votre adresse e-mail pour recevoir un lien de rÃ©initialisation.");
      return;
    }

    setChargement(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setChargement(false);

    if (error) setErreur(error.message);
    else setInformation("Si cette adresse correspond Ã  un compte, un lien de rÃ©initialisation va lui Ãªtre envoyÃ©.");
  }

  async function renvoyerConfirmation() {
    setErreur("");
    setInformation("");
    setRenvoiConfirmationEnCours(true);
    try {
      const { error } = await resendSignupConfirmation(email);
      if (error) throw error;
      setInformation("Si ce compte existe et que l’adresse n’est pas encore confirmée, un nouveau lien vient d’être envoyé.");
    } catch (error) {
      setErreur(confirmationErrorMessage(error));
    } finally {
      setRenvoiConfirmationEnCours(false);
    }
  }

  async function soumettre(event) {
    event.preventDefault();
    setErreur("");
    setChargement(true);
    setConfirmationNecessaire(false);
    try {
      let resultat;
      if (onglet === "connexion") {
        resultat = await supabase.auth.signInWithPassword({ email, password: motDePasse });
      } else if (onglet === "reinitialisation") {
        resultat = await supabase.auth.updateUser({ password: motDePasse });
      } else {
        resultat = await supabase.auth.signUp({
          email,
          password: motDePasse,
          options: { emailRedirectTo: emailConfirmationRedirectUrl(), data: { nom_complet: nom } },
        });
      }

      if (resultat.error) {
        setErreur(resultat.error.message);
        setConfirmationNecessaire(onglet === "connexion" && resultat.error.code === "email_not_confirmed");
        return;
      }
      if (onglet === "inscription" && !resultat.data.session) {
        setInformation("Compte créé. Consulte ta boîte e-mail pour confirmer ton adresse.");
        setConfirmationNecessaire(true);
        return;
      }
      if (onglet === "reinitialisation") {
        setInformation("Votre mot de passe a été modifié.");
        setOnglet("connexion");
        setMotDePasse("");
        return;
      }
      navigate(location.state?.retour || "/compte");
    } catch (error) {
      setErreur(error.message || "La requête a échoué. Vérifie ta connexion et réessaie.");
    } finally {
      setChargement(false);
    }
  }
  return (
    <div className="min-h-screen bg-bg py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/" className="font-head text-xl font-bold flex items-center gap-1 mb-6">
          <span className="text-ink">Book</span><span className="text-accent">Space</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-5">
          <form onSubmit={soumettre} className="flex-1 card">
            <div className="flex gap-6 border-b border-border mb-6 text-sm font-bold" hidden={onglet === "reinitialisation"}>
              <button type="button" onClick={() => setOnglet("connexion")} className={`pb-3 ${onglet === "connexion" ? "text-ink border-b-2 border-accent" : "text-faint"}`}>Se connecter</button>
              <button type="button" onClick={() => setOnglet("inscription")} className={`pb-3 ${onglet === "inscription" ? "text-ink border-b-2 border-accent" : "text-faint"}`}>CrÃ©er un compte</button>
            </div>

            <div className="font-head text-2xl font-extrabold mb-1.5">
              {onglet === "connexion" ? "Heureux de vous revoir" : onglet === "reinitialisation" ? "Choisissez un nouveau mot de passe" : "Rejoignez BookSpace"}
            </div>
            <div className="text-muted text-sm mb-6">
              {onglet === "connexion" ? "Retrouvez vos lectures, favoris et commandes." : onglet === "reinitialisation" ? "Votre nouveau mot de passe doit contenir au moins 8 caractÃ¨res." : "Inscrivez-vous pour dÃ©couvrir BookSpace."}
            </div>

            {onglet === "inscription" && (
              <>
              <div className="field">
                <label>Nom complet</label>
                <input className="input" placeholder="Votre nom et prÃ©nom" value={nom} onChange={(event) => setNom(event.target.value)} required />
              </div>
              <p className="text-muted text-xs mb-4">Chaque inscription crée un compte client. Une demande de profil vendeur se fait ensuite et doit être approuvée par un administrateur.</p>
              </>
            )}
            <div className="field">
              <label>Adresse e-mail</label>
              <div className="input flex items-center gap-2">
                <Mail size={15} className="text-faint shrink-0" />
                <input type="email" placeholder="vous@exemple.fr" className="flex-1 outline-none bg-transparent" value={email} onChange={(event) => setEmail(event.target.value)} readOnly={onglet === "reinitialisation"} required />
              </div>
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <div className="input flex items-center gap-2">
                <Lock size={15} className="text-faint shrink-0" />
                <input type={voirMdp ? "text" : "password"} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" className="flex-1 outline-none bg-transparent" value={motDePasse} onChange={(event) => setMotDePasse(event.target.value)} minLength={onglet === "reinitialisation" ? 8 : 6} required />
                <button type="button" onClick={() => setVoirMdp((v) => !v)} className="text-faint shrink-0">
                  {voirMdp ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {onglet === "connexion" && (
              <div className="flex justify-end items-center mb-5 mt-1 text-xs">
                <button type="button" onClick={demanderReinitialisation} disabled={chargement} className="text-accent-dark font-bold disabled:opacity-60">Mot de passe oubliÃ© ?</button>
              </div>
            )}

            {erreur && <div role="alert" className="bg-danger-bg text-danger rounded-lg p-3 mb-4 text-sm">{erreur}</div>}
            {information && <div role="status" className="bg-success-bg text-success rounded-lg p-3 mb-4 text-sm">{information}</div>}
            {confirmationNecessaire && <button type="button" onClick={renvoyerConfirmation} disabled={renvoiConfirmationEnCours || !email} className="mb-4 text-sm font-bold text-accent-dark disabled:opacity-60">{renvoiConfirmationEnCours ? "Envoi en cours…" : "Renvoyer le lien de confirmation"}</button>}
            <button type="submit" disabled={chargement} className="btn-accent w-full py-3.5 disabled:opacity-60">
              {chargement ? "Connexion en coursâ€¦" : onglet === "connexion" ? "AccÃ©der Ã  mon espace BookSpace" : onglet === "reinitialisation" ? "Modifier mon mot de passe" : "CrÃ©er mon compte"} â†’
            </button></form>

          <div className="w-full lg:w-[320px] shrink-0 bg-primary rounded-lg p-6 sm:p-7 text-white flex flex-col justify-between">
            <img src="/logo-icon.png" alt="BookSpace" className="h-14 w-auto mb-5" />
            <div>
              <div className="text-3xl leading-none mb-3 opacity-60">"</div>
              <div className="font-head text-base leading-relaxed mb-4">
                Un livre est une fenÃªtre par laquelle on s'Ã©vade. Retrouvez
                vos lectures physiques et numÃ©riques au mÃªme endroit.
              </div>
              <div className="text-white/60 text-xs">â€” Manifeste BookSpace</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
