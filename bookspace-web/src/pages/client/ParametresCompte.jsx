import { ShieldCheck } from "lucide-react";
import React from "react";

// PAGE : Paramètres et sécurité du compte (/compte/parametres)
export default function ParametresCompte() {
  return (
    <div>
      <div className="section-title mb-6">Préférences & sécurité</div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-5 w-full">
          <div className="card">
            <div className="card-title">Informations personnelles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label>Prénom</label>
                <input className="input" defaultValue="Éléonore" />
              </div>
              <div className="field">
                <label>Nom</label>
                <input className="input" defaultValue="de Montalembert" />
              </div>
              <div className="field">
                <label>E-mail</label>
                <input className="input" defaultValue="e.montalembert@institut-lettres.fr" />
              </div>
              <div className="field">
                <label>Téléphone</label>
                <input className="input" defaultValue="+33 6 42 89 00 12" />
              </div>
            </div>
            <button className="btn-primary btn-sm">Enregistrer les modifications</button>
          </div>

          <div className="card">
            <div className="card-title">Mot de passe</div>
            <div className="field">
              <label>Mot de passe actuel</label>
              <input className="input" type="password" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label>Nouveau mot de passe</label>
                <input className="input" type="password" />
              </div>
              <div className="field">
                <label>Confirmer</label>
                <input className="input" type="password" />
              </div>
            </div>
            <button className="btn-outline btn-sm">Mettre à jour le mot de passe</button>
          </div>
        </div>

        <div className="w-full md:w-[320px] shrink-0 space-y-5">
          <div className="card">
            <div className="card-title flex items-center gap-2"><ShieldCheck size={16}/> Double authentification</div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">SMS / App (+33 6 42 ** 12)</span>
              <span className="pill-success">Active</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Appareils connectés</div>
            <div className="text-sm text-muted mb-3">2 sessions actives</div>
            <div className="text-[12.5px] text-faint">
              Dernière connexion aujourd'hui à 14:15 depuis Paris (IP
              194.214.73.12)
            </div>
            <button className="btn-outline btn-sm w-full mt-3.5">Gérer les appareils</button>
          </div>
          <div className="card">
            <div className="card-title">Notifications</div>
            {["Confirmations de commande", "Offres et promotions", "Alertes de baisse de prix"].map((n) => (
              <label key={n} className="flex items-center justify-between text-sm py-2">
                {n}
                <input type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
