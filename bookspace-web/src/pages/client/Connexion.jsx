import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Store, PenLine, Mail, Lock, Eye, EyeOff, ShieldCheck, Library, Building2 } from "lucide-react";

// PAGE : Connexion / Inscription (/login)
// 3 espaces au choix : Lecteur, Libraire indépendant, Maison d'édition.
const espaces = [
  { cle: "lecteur", icone: BookOpen, titre: "Lecteur & Passionné", sous: "Bibliothèque, liseuses & commandes" },
  { cle: "libraire", icone: Store, titre: "Libraire Indépendant", sous: "Stocks, Click & Collect, Colissimo" },
  { cle: "editeur", icone: PenLine, titre: "Maison d'Édition & Auteur", sous: "Manuscrits, ePub & royautés" },
];

export default function Connexion() {
  const [espace, setEspace] = useState("lecteur");
  const [onglet, setOnglet] = useState("connexion");
  const [voirMdp, setVoirMdp] = useState(false);

  return (
    <div className="min-h-screen bg-bg py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/" className="font-head text-xl font-bold flex items-center gap-1 mb-6">
          <span className="text-ink">Book</span><span className="text-accent">Space</span>
        </Link>

        {/* Sélection de l'espace */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {espaces.map((e) => {
            const Icone = e.icone;
            return (
              <button
                key={e.cle}
                onClick={() => setEspace(e.cle)}
                className={`text-left border-[1.5px] rounded-lg p-4 flex items-center gap-3 ${espace === e.cle ? "border-accent bg-accent-pale" : "border-border bg-surface"}`}
              >
                <Icone size={20} className={espace === e.cle ? "text-accent-dark" : "text-muted"} />
                <div>
                  <div className="font-bold text-sm">{e.titre}</div>
                  <div className="text-faint text-[11px]">{e.sous}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 card">
            <div className="flex gap-6 border-b border-border mb-6 text-sm font-bold">
              <button onClick={() => setOnglet("connexion")} className={`pb-3 ${onglet === "connexion" ? "text-ink border-b-2 border-accent" : "text-faint"}`}>Se connecter</button>
              <button onClick={() => setOnglet("inscription")} className={`pb-3 ${onglet === "inscription" ? "text-ink border-b-2 border-accent" : "text-faint"}`}>Créer un compte</button>
            </div>

            <div className="font-head text-2xl font-extrabold mb-1.5">
              {onglet === "connexion" ? "Heureux de vous revoir" : "Rejoignez BookSpace"}
            </div>
            <div className="text-muted text-sm mb-6">
              {onglet === "connexion" ? "Retrouvez vos lectures, favoris et commandes." : "Créez votre compte en moins d'une minute."}
            </div>

            {onglet === "inscription" && (
              <div className="field">
                <label>Nom complet</label>
                <input className="input" placeholder="Votre nom et prénom" />
              </div>
            )}
            <div className="field">
              <label>Adresse e-mail</label>
              <div className="input flex items-center gap-2">
                <Mail size={15} className="text-faint shrink-0" />
                <input type="email" placeholder="vous@exemple.fr" className="flex-1 outline-none bg-transparent" />
              </div>
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <div className="input flex items-center gap-2">
                <Lock size={15} className="text-faint shrink-0" />
                <input type={voirMdp ? "text" : "password"} placeholder="••••••••••" className="flex-1 outline-none bg-transparent" />
                <button type="button" onClick={() => setVoirMdp((v) => !v)} className="text-faint shrink-0">
                  {voirMdp ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {onglet === "connexion" && (
              <div className="flex justify-between items-center mb-5 mt-1 text-xs">
                <label className="flex items-center gap-2 text-muted"><input type="checkbox" defaultChecked /> Se souvenir de moi</label>
                <span className="text-accent-dark font-bold cursor-pointer">Mot de passe oublié ?</span>
              </div>
            )}

            <Link to={espace === "lecteur" ? "/compte" : espace === "libraire" ? "/vendeur" : "/vendeur/inscription"} className="btn-accent w-full py-3.5">
              {onglet === "connexion" ? "Accéder à mon espace BookSpace" : "Créer mon compte"} →
            </Link>

            {espace === "libraire" && onglet === "inscription" && (
              <div className="text-faint text-[11px] text-center mt-3">
                Votre demande sera soumise à vérification (KYB) avant activation.
              </div>
            )}
          </div>

          <div className="w-full lg:w-[320px] shrink-0 bg-primary rounded-lg p-6 sm:p-7 text-white flex flex-col justify-between">
            <img src="/logo-icon.png" alt="BookSpace" className="h-14 w-auto mb-5" />
            <div>
              <div className="text-3xl leading-none mb-3 opacity-60">"</div>
              <div className="font-head text-base leading-relaxed mb-4">
                Un livre est une fenêtre par laquelle on s'évade. Retrouvez
                vos lectures physiques et numériques au même endroit.
              </div>
              <div className="text-white/60 text-xs">— Manifeste BookSpace</div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/15 text-xs text-white/70 space-y-2">
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="shrink-0" /> Chiffrement TLS 1.3 & stockage souverain</div>
              <div className="flex items-center gap-2"><Library size={14} className="shrink-0" /> Pérennité ePub garantie, DRM social transparent</div>
              <div className="flex items-center gap-2"><Building2 size={14} className="shrink-0" /> Circuit court : 450+ libraires partenaires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
