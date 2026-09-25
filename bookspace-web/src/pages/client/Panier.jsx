import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCartItems, removeCartItem, updateCartItemQuantity } from "../../lib/cart";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { FilAriane } from "../../components/ui/Composants";
import { Package, Wifi, Gift, Bookmark, Trash2, Plus, Minus, Truck, ShieldCheck, BookOpen, Lock, Tag, Smartphone } from "lucide-react";

// PAGE : Panier d'achat (/panier)
// Regroupe les articles papier et numériques avant paiement.
// Quantités et suppression sont réellement interactives (état local).
export default function Panier() {
  const [articles, setArticles] = useState(() => getCartItems());
  const [livraison, definirLivraison] = useState("collect");
  const [codePromo, setCodePromo] = useState("");

  useEffect(() => {
    const next = getCartItems();
    setArticles(next);
  }, []);

  function changerQuantite(id, format, delta) {
    const next = updateCartItemQuantity(id, format, delta);
    setArticles(next);
  }

  function supprimer(id, format) {
    const next = removeCartItem(id, format);
    setArticles(next);
  }

  const sousTotal = articles.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1), 0);
  const fraisPort = livraison === "collect" ? 0 : articles.reduce((s, i) => s + Number(i.shipping || 0), 0);
  const total = sousTotal + fraisPort;

  if (articles.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <Package size={40} className="mx-auto text-faint mb-4" />
        <div className="section-title mb-2">Votre panier est vide</div>
        <div className="text-muted text-sm mb-6">Direction le catalogue pour trouver votre prochaine lecture.</div>
        <Link to="/catalogue" className="btn-accent">Explorer le catalogue</Link>
      </div>
    );
  }

  return (
    <div>
      <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Panier" }]} />

      <div className="px-4 sm:px-6 lg:px-10 pt-4 flex flex-wrap items-center gap-3">
        <div className="section-title mb-0">Mon Panier</div>
        <span className="pill-success">{articles.length} articles</span>
        <span className="pill-accent flex items-center gap-1.5"><Wifi size={12} /> Commande hybride</span>
        <span className="ml-auto text-xs text-success font-bold hidden sm:flex items-center gap-1.5">
          <ShieldCheck size={14} /> Panier sauvegardé et synchronisé
        </span>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-10 mt-4 bg-info-bg text-info text-[12.5px] rounded-lg p-3.5 flex items-center gap-2.5">
        <Package size={16} className="shrink-0" />
        Vos ouvrages papier sont préparés avec soin par nos libraires
        indépendants, et vos ePubs sont immédiatement accessibles après
        validation.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-10 pt-6 pb-10">
        <div className="flex-[1.6] space-y-4">
          {articles.map((item) => {
            const numerique = String(item.format || "").toLowerCase().includes("epub") || String(item.format || "").toLowerCase().includes("pdf");
            return (
              <div key={`${item.id}-${item.format}`} className="card flex flex-col sm:flex-row gap-4">
                <CouvertureLivre graine={item.id} className="w-full sm:w-[90px] shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`${numerique ? "pill-info" : "pill-warning"} flex items-center gap-1.5 w-fit`}>
                        {numerique ? <Smartphone size={11} /> : <BookOpen size={11} />}
                        {numerique ? "Téléchargement immédiat (DRM Social)" : "Format Papier Broché"}
                      </span>
                      <div className="font-head font-bold text-base mt-1.5">{item.title}</div>
                      <div className="text-muted text-xs">{item.author} · Vendu par {item.seller}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-head text-lg font-extrabold">{(item.price * item.qty).toFixed(2)} €</div>
                      <div className="text-faint text-[10px]">Prix unique Loi Lang</div>
                    </div>
                  </div>

                  {!numerique && (
                    <label className="flex items-center gap-2 text-xs text-muted mt-3">
                      <input type="checkbox" /> <Gift size={13} /> Ajouter un mot cadeau manuscrit du libraire
                      <span className="pill-success ml-1">GRATUIT</span>
                    </label>
                  )}
                  {numerique && (
                    <div className="text-xs text-muted mt-3">Licence personnelle unique (1 exemplaire)</div>
                  )}

                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3.5">
                    {!numerique ? (
                      <div className="flex items-center border border-borderStrong rounded-[7px] overflow-hidden text-xs">
                        <button onClick={() => changerQuantite(item.id, item.format, -1)} className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surfaceAlt">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <button onClick={() => changerQuantite(item.id, item.format, 1)} className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surfaceAlt">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-success text-xs font-bold">En stock chez le libraire</span>
                    )}
                    <div className="flex gap-4 text-xs text-muted font-semibold">
                      <button className="flex items-center gap-1.5"><Bookmark size={13} /> Mettre de côté</button>
                      <button onClick={() => supprimer(item.id, item.format)} className="flex items-center gap-1.5 text-danger">
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card">
            <div className="font-bold text-sm mb-3 flex items-center gap-2"><Truck size={16} /> Mode de délivrance du livre papier</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`border-[1.5px] rounded-lg p-3 flex items-start gap-2.5 cursor-pointer ${livraison === "collect" ? "border-accent bg-accent-pale" : "border-border"}`}>
                <input type="radio" name="livraison" checked={livraison === "collect"} onChange={() => definirLivraison("collect")} className="mt-1" />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">Click & Collect 1h <span className="pill-success">Gratuit</span></div>
                  <div className="text-faint mt-0.5">Librairie Delamain, Paris</div>
                </div>
              </label>
              <label className={`border-[1.5px] rounded-lg p-3 flex items-start gap-2.5 cursor-pointer ${livraison === "colissimo" ? "border-accent bg-accent-pale" : "border-border"}`}>
                <input type="radio" name="livraison" checked={livraison === "colissimo"} onChange={() => definirLivraison("colissimo")} className="mt-1" />
                <div className="text-xs">
                  <div className="font-bold">Colissimo Suivi Domicile · 3,50 €</div>
                  <div className="text-faint mt-0.5">Sous 48 à 72h ouvrées</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[340px] shrink-0">
          <div className="card lg:sticky lg:top-4">
            <div className="card-title">Récapitulatif</div>
            <div className="flex justify-between text-sm text-muted py-1.5">
              <span>Articles ({articles.length})</span>
              <span className="font-bold text-ink">{sousTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-muted py-1.5">
              <span>Livraison</span>
              <span className="font-bold text-success">{fraisPort === 0 ? "Offert" : `${fraisPort.toFixed(2)} €`}</span>
            </div>
            <div className="flex gap-2.5 my-3.5">
              <div className="input flex-1 flex items-center gap-2">
                <Tag size={14} className="text-faint shrink-0" />
                <input
                  value={codePromo}
                  onChange={(e) => setCodePromo(e.target.value)}
                  placeholder="Code promo ou carte cadeau"
                  className="w-full outline-none bg-transparent"
                />
              </div>
              <button className="btn-outline btn-sm">Appliquer</button>
            </div>
            <div className="flex justify-between border-t border-border pt-3.5 mt-1 text-base font-bold">
              <span>Total à régler</span>
              <span className="text-accent text-xl">{total.toFixed(2)} €</span>
            </div>
            <Link to="/paiement" className="btn-accent w-full mt-4 py-3.5 flex items-center justify-center gap-2">
              <Lock size={15} /> Valider et Payer ({total.toFixed(2)} €)
            </Link>
            <div className="text-[11px] text-faint text-center mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} /> Protocole 3D Secure v2 · Chiffrement 256 bits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
