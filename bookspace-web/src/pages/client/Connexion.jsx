import Icone from "../../components/ui/Icone";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// PAGE : Connexion / Inscription (/login)
// Bascule entre l'espace client et l'espace vendeur.
export default function Connexion() {
  const [mode, setMode] = useState("client");

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-[44%] bg-primary text-white p-14 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="font-head text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          BookSpace
        </Link>
        <div className="font-head text-[19px] leading-relaxed relative z-10">
          « Le livre papier et numérique réunis sur une seule place de
          marché — au service des librairies indépendantes. »
          <div className="text-sm font-body opacity-60 mt-5">
            +120 librairies partenaires · 50 000+ titres
          </div>
        </div>
        <div className="text-sm opacity-55">
          © 2026 BookSpace — Plateforme éthique du livre
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-[440px]">
          <div className="section-title mb-1.5">Bon retour parmi nous</div>
          <div className="text-muted text-sm mb-6">
            Connectez-vous pour accéder à votre espace
          </div>

          <div className="flex bg-surfaceAlt rounded-[10px] p-1 mb-7">
            <button
              onClick={() => setMode("client")}
              className={`flex-1 text-center py-2.5 rounded-[8px] text-[13px] font-bold ${mode === "client" ? "bg-surface text-primary shadow-card" : "text-muted"}`}
            >
              Espace client
            </button>
            <button
              onClick={() => setMode("vendeur")}
              className={`flex-1 text-center py-2.5 rounded-[8px] text-[13px] font-bold ${mode === "vendeur" ? "bg-surface text-primary shadow-card" : "text-muted"}`}
            >
              Espace vendeur
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 border border-borderStrong rounded-[8px] py-2.5 text-[13px] font-bold text-muted mb-2.5">
            <span className="inline-flex items-center gap-2"><Icone name="CirclePlay" size={16} /> Continuer avec Google</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2.5 border border-borderStrong rounded-[8px] py-2.5 text-[13px] font-bold text-muted mb-5">
            <span className="inline-flex items-center gap-2"><Icone name="User" size={16} /> Continuer avec Apple</span>
          </button>
          <div className="flex items-center gap-3 text-[11.5px] text-faint mb-5">
            <div className="flex-1 h-px bg-border" /> OU PAR E-MAIL
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="field mb-4">
            <label>Adresse e-mail</label>
            <input className="input" placeholder="vous@exemple.com" />
          </div>
          <div className="field mb-2">
            <label>Mot de passe</label>
            <input className="input" type="password" placeholder="••••••••••" />
          </div>
          <div className="flex justify-between items-center mb-5 mt-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" defaultChecked /> Se souvenir de moi
            </label>
            <span className="text-sm font-bold text-accent-dark cursor-pointer">
              Mot de passe oublié ?
            </span>
          </div>

          <Link
            to={mode === "client" ? "/compte" : "/vendeur"}
            className="btn-primary w-full py-3.5"
          >
            Se connecter
          </Link>

          <div className="text-center text-sm text-muted mt-5">
            Pas encore de compte ?{" "}
            <span className="font-bold text-primary cursor-pointer">
              Créer un compte gratuitement
            </span>
          </div>
          <div className="h-px bg-border my-5" />
          <div className="text-center text-sm text-muted">
            Vous êtes libraire ou éditeur ?{" "}
            <Link to="/vendeur/inscription" className="font-bold text-accent-dark">
              Rejoindre le réseau vendeurs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
