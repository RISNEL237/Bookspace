import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../../lib/cart";
import { createCheckoutSession, createMobileMoneyPayment, createOrder } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { CreditCard, Smartphone, Fingerprint, Lock, ArrowLeftRight } from "lucide-react";

// PAGE : Paiement sécurisé (/paiement)
// Saisie du moyen de paiement (carte, Mobile Money) + répartition
// transparente entre les vendeurs (split-payment).
const methodes = [
  { cle: "carte", label: "Carte Bancaire", icone: CreditCard },
  { cle: "mtn", label: "MTN MoMo", icone: Smartphone },
  { cle: "om", label: "Orange Money", icone: Smartphone },
  { cle: "applegoogle", label: "Apple / Google", icone: Fingerprint },
];

export default function Paiement() {
  const navigate = useNavigate();
  const [methode, definirMethode] = useState("carte");
  const [erreur, definirErreur] = useState("");
  const [envoi, definirEnvoi] = useState(false);
  const [telephone, definirTelephone] = useState("");
  const articles = getCartItems();
  const total = articles.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1), 0) + articles.reduce((s, i) => s + Number(i.shipping || 0), 0);

  async function confirmerPaiement() {
    definirErreur("");
    definirEnvoi(true);

    try {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login", { state: { retour: "/paiement" } });
        return;
      }

      if (articles.some((article) => !article.sellerId)) {
        throw new Error("Un vendeur est manquant pour un article du panier.");
      }

      const fournisseur = methode === "mtn" ? "mtn_momo" : methode === "om" ? "orange_money" : "stripe";
      const commande = await createOrder(articles, fournisseur, telephone || null);
      if (["mtn", "om"].includes(methode)) {
        const paiement = await createMobileMoneyPayment(commande.id, methode === "mtn" ? "mtn" : "orange", telephone);
        navigate("/commande/confirmation", { state: { commande, paiement } });
        return;
      }

      const session = await createCheckoutSession(commande.id);

      if (!session.url) {
        throw new Error("Stripe n'a pas retourné de page de paiement.");
      }

      window.location.assign(session.url);
    } catch (error) {
      definirErreur(error.message || "Le paiement n'a pas pu être confirmé.");
    } finally {
      definirEnvoi(false);
    }
  }

  return (
    <div>
      {/* En-tête sombre avec étapes */}
      <div className="bg-primary text-white px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap items-center gap-3">
        <span className="font-head font-bold">Book<span className="text-accent">Space</span></span>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] sm:text-xs text-white/60 ml-2">
          <span>1. Panier</span> <span>›</span> <span>2. Livraison & Coordonnées</span> <span>›</span>
          <span className="text-accent font-bold">3. Paiement Sécurisé</span>
        </div>
        <span className="ml-auto pill" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
          Paiement Séquestre 256-bit
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-10 pt-6 pb-10">
        <div className="flex-[1.5]">
          <div className="card mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="card-title mb-0">Option de règlement</div>
              <span className="pill-muted">MULTI-DEVISES UE</span>
            </div>
            <div className="text-muted text-xs mb-4">Sélectionnez votre moyen de transaction protégé</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {methodes.map((m) => (
                <button
                  key={m.cle}
                  onClick={() => definirMethode(m.cle)}
                  className={`border-[1.5px] rounded-lg p-3 text-center text-[12px] font-bold ${methode === m.cle ? "border-accent bg-accent-pale text-accent-dark" : "border-borderStrong text-muted"}`}
                >
                  <m.icone size={20} className="mx-auto mb-1" />
                  {m.label}
                </button>
              ))}
            </div>

            {methode === "carte" ? (
              <>
                <div className="field">
                  <label>Nom du titulaire de la carte</label>
                  <input className="input" placeholder="Votre nom complet" />
                </div>
                <div className="field">
                  <label>Numéro de carte bancaire</label>
                  <input className="input" inputMode="numeric" placeholder="Saisi directement sur Stripe" disabled />
                </div>
                <div className="flex gap-4">
                  <div className="field flex-1">
                    <label>Date d'expiration (MM/AA)</label>
                    <input className="input" placeholder="Saisi directement sur Stripe" disabled />
                  </div>
                  <div className="field flex-1">
                    <label>Code de sécurité</label>
                    <input className="input" placeholder="Saisi directement sur Stripe" disabled />
                  </div>
                </div>
              </>
            ) : (
              <div className="field">
                <label>Numéro de téléphone {methode === "mtn" ? "MTN MoMo" : methode === "om" ? "Orange Money" : ""}</label>
                <input className="input" placeholder="+237 6 XX XX XX XX" value={telephone} onChange={(event) => definirTelephone(event.target.value)} required />
                <div className="text-faint text-[11.5px] mt-2">
                  Vous recevrez une notification de confirmation sur votre téléphone pour valider le paiement.
                </div>
              </div>
            )}
          </div>

          <div className="card mb-5">
            <div className="flex justify-between items-center">
              <div className="card-title mb-0 text-sm">Compte & Coordonnées de Facturation</div>
              <button className="text-accent-dark text-xs font-bold">Modifier</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-muted">
              <div>
                <div className="font-bold text-ink">Éléonore de Montalembert</div>
                <div>e.montalembert@institut-lettres.fr</div>
              </div>
              <div>
                <div className="font-bold text-ink">Adresse de facturation</div>
                <div>14 Rue de l'Odéon, 75006 Paris</div>
              </div>
            </div>
          </div>

          {erreur && <div className="bg-danger-bg text-danger rounded-lg p-3 mb-4 text-sm">{erreur}</div>}
          <button onClick={confirmerPaiement} disabled={envoi || articles.length === 0} className="btn-accent w-full py-4 disabled:opacity-60">
            <Lock size={15} className="inline mr-1.5 -mt-0.5" /> Confirmer et Payer {total.toFixed(2)} €
          </button>
          <div className="flex flex-wrap gap-2.5 mt-4 justify-center">
            {["PCI-DSS Niveau 1", "Chiffrement AES-256", "3-D Secure 2.0", "Garantie 14 Jours"].map((p) => (
              <span key={p} className="pill-muted">{p}</span>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="card">
            <div className="flex justify-between items-center">
              <div className="card-title mb-0 flex items-center gap-2"><ArrowLeftRight size={16}/> Transparence de la Transaction</div>
              <span className="pill-success">Stripe Connect</span>
            </div>
            <div className="card-sub">Réparti automatiquement vers chaque bénéficiaire certifié</div>
            <div className="bg-primary rounded-lg p-4.5 text-white mb-4">
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-75">Montant total débité</div>
                <span className="pill" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>1 seul prélèvement</span>
              </div>
              <div className="font-head text-[26px] font-bold">{total.toFixed(2)} €</div>
            </div>

            <div className="h-2 rounded-full overflow-hidden flex mb-4">
              <div className="bg-info" style={{ width: "63%" }} />
              <div className="bg-accent" style={{ width: "29%" }} />
              <div className="bg-warning" style={{ width: "8%" }} />
            </div>

            {[
              ["bg-info", "Librairie Partenaire Delamain", "Livre papier + frais de port, 100% marge respectée", (total * 0.63).toFixed(2)],
              ["bg-accent", "Éditions Horizon Bleu · Auteur", "ePub numérique sécurisé DRM social, droits d'auteur", (total * 0.29).toFixed(2)],
              ["bg-warning", "Plateforme BookSpace", "Frais d'infrastructure, hébergement & escrow", (total * 0.08).toFixed(2)],
            ].map(([couleur, nom, desc, montant]) => (
              <div key={nom} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                <div className={`w-2.5 h-2.5 rounded-full ${couleur} shrink-0`} />
                <div className="flex-1">
                  <div className="font-bold text-[13px]">{nom}</div>
                  <div className="text-faint text-[11px]">{desc}</div>
                </div>
                <div className="font-bold text-sm">{montant} €</div>
              </div>
            ))}
          </div>

          <div className="card mt-4.5">
            <div className="card-title text-sm">Récapitulatif des Articles ({articles.length})</div>
            {articles.map((it) => (
              <div key={`${it.id}-${it.format}`} className="flex gap-3 items-center py-2.5 border-b border-border last:border-b-0">
                <CouvertureLivre graine={it.id} className="w-[34px] h-[46px] shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold">{it.title}</div>
                  <div className="text-faint text-xs">{it.format.split(" —")[0]} · {it.author}</div>
                </div>
                <div className="text-sm font-bold">{it.price.toFixed(2)} €</div>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t border-border font-bold">
              <span>Total TTC à régler</span>
              <span className="text-accent text-lg">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
