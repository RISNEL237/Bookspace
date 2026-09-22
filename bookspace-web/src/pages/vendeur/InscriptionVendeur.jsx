import Icone from "../../components/ui/Icone";
import React from "react";
import { Link } from "react-router-dom";

// PAGE : Inscription vendeur / vérification KYB (/vendeur/inscription)
// Étape de dépôt des justificatifs avant activation du compte.
const steps = [
  { n: "Check", label: "Type de structure", done: true },
  { n: "2", label: "Vérification (KYB)", on: true },
  { n: "3", label: "Compte de paiement" },
  { n: "4", label: "Catalogue initial" },
];

export default function InscriptionVendeur() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-surface border-b border-border px-8 py-4 flex items-center">
        <Link to="/" className="font-head text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent inline-block" />
          BookSpace
          <span className="font-body text-muted font-medium text-sm ml-1.5">
            Rejoindre le réseau vendeurs
          </span>
        </Link>
        <div className="ml-auto text-sm text-muted">
          Déjà partenaire ? <Link to="/login" className="font-bold text-primary">Se connecter</Link>
        </div>
      </div>

      <div className="py-9 px-6">
        <div className="flex justify-center items-center gap-0 mb-9 flex-wrap">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done ? "bg-success text-white" : s.on ? "bg-primary text-white" : "bg-surfaceAlt text-faint"}`}>
                  {s.n}
                </div>
                <span className={`text-[12.5px] font-bold ${s.on ? "text-primary" : "text-faint"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-[50px] h-px bg-border mx-3.5" />}
            </React.Fragment>
          ))}
        </div>

        <div className="max-w-[760px] mx-auto">
          <div className="section-title text-center mb-1.5">Vérifions l'identité de votre structure</div>
          <div className="text-muted text-sm text-center mb-7">
            Ces informations garantissent la conformité DAC7 et sécurisent
            les futurs versements.
          </div>

          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label>Nom commercial</label>
                <input className="input" defaultValue="Librairie de l'Odéon" />
              </div>
              <div className="field">
                <label>Type de structure</label>
                <input className="input" defaultValue="SARL — Librairie indépendante" />
              </div>
              <div className="field">
                <label>SIRET / n° d'entreprise</label>
                <input className="input" defaultValue="412 890 00021" />
              </div>
              <div className="field">
                <label>Pays d'exercice</label>
                <input className="input" defaultValue="France" />
              </div>
            </div>
            <div className="h-px bg-border my-5" />
            <div className="card-title text-sm">Documents justificatifs</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="bg-surfaceAlt border border-dashed border-borderStrong rounded-[10px] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-success-bg text-success flex items-center justify-center"><Icone name="Check" size={18} /></div>
                <div>
                  <div className="text-sm font-bold">Kbis (extrait)</div>
                  <div className="text-faint text-xs">Vérifié automatiquement</div>
                </div>
              </div>
              <div className="bg-surfaceAlt border border-dashed border-borderStrong rounded-[10px] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-success-bg text-success flex items-center justify-center"><Icone name="Check" size={18} /></div>
                <div>
                  <div className="text-sm font-bold">RIB / IBAN</div>
                  <div className="text-faint text-xs">Format conforme</div>
                </div>
              </div>
            </div>
            <div className="bg-surfaceAlt border border-dashed border-borderStrong rounded-[10px] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-warning-bg text-warning flex items-center justify-center"><Icone name="FileText" size={18} /></div>
              <div>
                <div className="text-sm font-bold">Pièce d'identité du gérant</div>
                <div className="text-faint text-xs">Glissez un fichier PDF ou JPG — 10 Mo max</div>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-muted mt-5">
              <input type="checkbox" defaultChecked />
              J'accepte la charte des librairies indépendantes et les
              conditions vendeurs BookSpace
            </label>

            <div className="flex justify-between mt-6">
              <button className="btn-outline">← Étape précédente</button>
              <Link to="/vendeur" className="btn-primary">
                Continuer vers le compte de paiement →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
