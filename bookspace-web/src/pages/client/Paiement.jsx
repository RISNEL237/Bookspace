import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { articlesPanier } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";

// PAGE : Paiement sécurisé (/paiement)
// Saisie de la carte + répartition transparente entre les vendeurs.
export default function Paiement() {
  const navigate = useNavigate();
  const [methode, definirMethode] = useState("card");
  const total = articlesPanier.reduce((s, i) => s + i.price * i.qty, 0) + articlesPanier.reduce((s, i) => s + i.shipping, 0);

  return (
    <div>
      <div className="px-10 pt-5 flex gap-2.5 text-[12.5px] text-faint font-bold items-center">
        <div className="flex items-center gap-2 text-ink">
          <span className="w-[22px] h-[22px] rounded-full bg-success text-white flex items-center justify-center text-[11px]">✓</span>
          Panier
        </div>
        ———
        <div className="flex items-center gap-2 text-ink">
          <span className="w-[22px] h-[22px] rounded-full bg-success text-white flex items-center justify-center text-[11px]">✓</span>
          Livraison & coordonnées
        </div>
        ———
        <div className="flex items-center gap-2 text-primary">
          <span className="w-[22px] h-[22px] rounded-full bg-primary text-white flex items-center justify-center text-[11px]">3</span>
          Paiement sécurisé
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-7 px-10 pt-6 pb-10">
        <div className="flex-[1.5]">
          <div className="section-title text-xl">Options de paiement</div>
          <div className="text-muted text-sm mb-5 mt-1">
            Réglez en une seule fois — la répartition entre les vendeurs est
            automatique.
          </div>
          <div className="flex gap-3 mb-5">
            {[["card", "💳 Carte bancaire"], ["mobile", "📱 Paiement mobile"], ["paypal", "🅿️ PayPal"]].map(([k, l]) => (
              <button
                key={k}
                onClick={() => definirMethode(k)}
                className={`flex-1 border-[1.5px] rounded p-3.5 text-center text-[12.5px] font-bold ${methode === k ? "border-primary bg-primary-pale text-primary" : "border-borderStrong text-muted"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="field">
              <label>Numéro de carte</label>
              <input className="input" defaultValue="4532 9012 3456 8923" />
            </div>
            <div className="flex gap-4">
              <div className="field flex-1">
                <label>Expiration (MM/AA)</label>
                <input className="input" defaultValue="11 / 27" />
              </div>
              <div className="field flex-1">
                <label>Code CVC</label>
                <input className="input" defaultValue="•••" />
              </div>
            </div>
            <div className="field">
              <label>Titulaire de la carte</label>
              <input className="input" defaultValue="Éléonore de Montalembert" />
            </div>
            <button onClick={() => navigate("/commande/confirmation")} className="btn-primary w-full py-4 mt-1.5">
              🔒 Confirmer le paiement de {total.toFixed(2)} €
            </button>
            <div className="flex gap-2.5 mt-4 justify-center">
              {["PCI-DSS Niveau 1", "Chiffrement AES-256", "3-D Secure"].map((p) => (
                <span key={p} className="pill-muted">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="card">
            <div className="card-title">🔀 Transparence de la transaction</div>
            <div className="card-sub">Paiement unique, réparti automatiquement entre 2 vendeurs</div>
            <div className="bg-primary rounded p-4.5 text-white mb-4">
              <div className="text-sm opacity-75">Montant total débité</div>
              <div className="font-head text-[26px] font-bold">{total.toFixed(2)} €</div>
            </div>
            {[
              ["accent", "Part plateforme BookSpace", "Frais de service & hébergement", "4,50 €"],
              ["info", "Librairie Delamain", "Livre papier + frais de port", "18,99 €"],
              ["warning", "Éditions Horizon Bleu", "E-pub — rémunération directe", "9,99 €"],
            ].map(([color, name, desc, amt]) => (
              <div key={name} className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0">
                <div className={`w-2.5 h-2.5 rounded-full bg-${color} shrink-0`} />
                <div className="flex-1">
                  <div className="font-bold text-sm">{name}</div>
                  <div className="text-faint text-xs">{desc}</div>
                </div>
                <div className="font-bold">{amt}</div>
              </div>
            ))}
          </div>
          <div className="card mt-4.5">
            <div className="card-title text-sm">Articles de la commande ({articlesPanier.length})</div>
            {articlesPanier.map((it) => (
              <div key={it.id} className="flex gap-3 items-center py-2.5 border-b border-border last:border-b-0">
                <CouvertureLivre cover={it.cover} className="w-[34px] h-[46px] shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold">{it.title}</div>
                  <div className="text-faint text-xs">{it.format.split(" —")[0]} · {it.author}</div>
                </div>
                <div className="text-sm font-bold">{it.price.toFixed(2)} €</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
