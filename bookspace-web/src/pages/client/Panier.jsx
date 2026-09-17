import React from "react";
import { Link } from "react-router-dom";
import { articlesPanier } from "../../lib/donnees";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { FilAriane } from "../../components/ui/Composants";
import { Shuffle, Save, Book, Heart, Trash2, ArrowLeft, Lock } from "lucide-react";

// PAGE : Panier d'achat (/panier)
// Regroupe les articles papier et numériques avant paiement.
export default function Panier() {
  const subtotal = articlesPanier.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = articlesPanier.reduce((s, i) => s + i.shipping, 0);
  const total = subtotal + shipping;

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: `Mon panier (${articlesPanier.length} articles)` }]} />
      <div className="flex flex-col md:flex-row gap-7 px-10 pt-6 pb-10">
        <div className="flex-[1.6]">
          <div className="section-title">Mon panier d'achat</div>
          <div className="text-muted text-sm mb-4.5 mt-1">
            Vos ouvrages physiques sont expédiés par nos librairies
            partenaires ; vos titres numériques rejoignent instantanément
            votre bibliothèque.
          </div>

          {/* Bannière d'information avec l'icône Shuffle stylisée */}
          <div className="bg-info-bg rounded p-3.5 flex items-center gap-3 mb-5 text-[12.5px]">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-info-bg text-info flex items-center justify-center shrink-0">
              <Shuffle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <b>Commande hybride groupée</b> — 1 envoi postal + 1
              téléchargement instantané, réglés en un seul paiement.
            </div>
          </div>

          {articlesPanier.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded p-5 flex gap-4.5 mb-4">
              <CouvertureLivre cover={item.cover} title={item.title.toUpperCase()} className="w-[78px] h-[108px] shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-head font-bold text-[15.5px]">{item.title}</div>
                    <div className="text-xs text-muted mb-2.5">{item.author}</div>
                  </div>
                  <div className="font-head text-[17px] font-bold text-primary">{item.price.toFixed(2)} €</div>
                </div>
                
                <div className="text-xs text-muted mb-2.5 flex items-center gap-2">
                  <span className={`pill-${item.format.includes("E-pub") ? "info" : "accent"} flex items-center gap-1`}>
                    {item.format.includes("E-pub") ? (
                      <Save size={12} strokeWidth={2.5} />
                    ) : (
                      <Book size={12} strokeWidth={2.5} />
                    )} 
                    {item.format}
                  </span>{" "}
                  <span>&nbsp; Vendu par <b>{item.seller}</b></span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  {item.format.includes("E-pub") ? (
                    <div className="text-sm text-muted">Licence d'usage perpétuelle · 1 exemplaire</div>
                  ) : (
                    <div className="flex items-center border border-borderStrong rounded-[7px] overflow-hidden text-xs">
                      <button className="w-[26px] h-[26px] font-bold text-muted hover:bg-surfaceAlt transition-colors">–</button>
                      <span className="w-7 text-center font-bold">{item.qty}</span>
                      <button className="w-[26px] h-[26px] font-bold text-muted hover:bg-surfaceAlt transition-colors">+</button>
                    </div>
                  )}
                  
                  {/* Liens d'action convertis en boutons cliquables avec effet hover */}
                  <div className="flex gap-4 text-xs text-muted font-semibold">
                    <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                      <Heart size={14} />
                      <span>Favoris</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                      <Trash2 size={14} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/catalogue" className="btn-outline inline-flex items-center gap-2 mt-2">
            <ArrowLeft size={16} /> Continuer mes découvertes
          </Link>
        </div>

        <div className="flex-1">
          <div className="card">
            <div className="card-title">Récapitulatif</div>
            <div className="card-sub">{articlesPanier.length} titres</div>
            <div className="flex justify-between text-sm text-muted py-2">
              <span>Sous-total articles</span>
              <span className="font-bold text-ink">{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-muted py-2">
              <span>Frais de port (Colissimo)</span>
              <span className="font-bold text-ink">{shipping.toFixed(2)} €</span>
            </div>
            <div className="flex gap-2.5 my-4">
              <input className="input flex-1" placeholder="Code promo ou bon d'achat" />
              <button className="btn-outline btn-sm">Appliquer</button>
            </div>
            <div className="flex justify-between border-t border-border pt-4 mt-2 text-base font-bold text-primary">
              <span>Montant total TTC</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            <Link to="/paiement" className="btn-primary w-full mt-4.5 py-3.5 flex items-center justify-center gap-2">
              <Lock size={16} strokeWidth={2.5} />
              <span>Procéder au paiement sécurisé</span>
            </Link>
            
            <div className="flex gap-2.5 mt-4">
              {["CB", "VISA", "Mastercard", "Apple Pay"].map((p) => (
                <div key={p} className="border border-border rounded-[6px] px-2.5 py-1.5 text-[11px] font-bold text-muted">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
