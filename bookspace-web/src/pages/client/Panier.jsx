import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCartItems, removeCartItem, updateCartItemQuantity } from "../../lib/cart";
import { formatMoney } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { FilAriane } from "../../components/ui/Composants";
import { Package, Bookmark, Trash2, Plus, Minus, Truck, ShieldCheck, BookOpen, Lock, Smartphone } from "lucide-react";

// PAGE : Panier d'achat (/panier)
// Regroupe les articles papier et numériques avant paiement.
// Quantités et suppression sont réellement interactives (état local).
export default function Panier() {
  const [articles, setArticles] = useState(() => getCartItems());

  useEffect(() => {
    const next = getCartItems();
    setArticles(next);
  }, []);

  function changerQuantite(id, format, delta, offerId) {
    const next = updateCartItemQuantity(id, format, delta, offerId);
    setArticles(next);
  }

  function supprimer(id, format, offerId) {
    const next = removeCartItem(id, format, offerId);
    setArticles(next);
  }

  const sousTotal = articles.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1), 0);
  const fraisPort = articles.reduce((s, i) => s + Number(i.shipping || 0), 0);
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
        <span className="ml-auto text-xs text-success font-bold hidden sm:flex items-center gap-1.5">
          <ShieldCheck size={14} /> Panier conservé sur cet appareil
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
                      <div className="font-head text-lg font-extrabold">{formatMoney(item.price * item.qty)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3.5">
                    {!numerique ? (
                      <div className="flex items-center border border-borderStrong rounded-[7px] overflow-hidden text-xs">
                        <button onClick={() => changerQuantite(item.id, item.format, -1, item.offerId)} className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surfaceAlt">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <button onClick={() => changerQuantite(item.id, item.format, 1, item.offerId)} className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surfaceAlt">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted text-xs">Quantité numérique : {item.qty}</span>
                    )}
                    <div className="flex gap-4 text-xs text-muted font-semibold">
                      <Link to="/compte/envies" className="flex items-center gap-1.5"><Bookmark size={13} /> Liste d'envies</Link>
                      <button onClick={() => supprimer(item.id, item.format, item.offerId)} className="flex items-center gap-1.5 text-danger">
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {articles.some((item) => !String(item.format || "").toLowerCase().includes("epub") && !String(item.format || "").toLowerCase().includes("pdf")) && <div className="card"><div className="font-bold text-sm mb-2 flex items-center gap-2"><Truck size={16} /> Livraison au Cameroun</div><div className="text-muted text-sm">Le retrait auprès du vendeur est disponible. Les tarifs de livraison à domicile selon la ville et le poids restent à configurer.</div></div>}
        </div>

        <div className="w-full lg:w-[340px] shrink-0">
          <div className="card lg:sticky lg:top-4">
            <div className="card-title">Récapitulatif</div>
            <div className="flex justify-between text-sm text-muted py-1.5">
              <span>Articles ({articles.length})</span>
              <span className="font-bold text-ink">{formatMoney(sousTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted py-1.5">
              <span>Livraison</span>
              <span className="font-bold text-success">{fraisPort === 0 ? "Retrait / à confirmer" : formatMoney(fraisPort)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3.5 mt-1 text-base font-bold">
              <span>Total à régler</span>
              <span className="text-accent text-xl">{formatMoney(total)}</span>
            </div>
            <Link to="/paiement" className="btn-accent w-full mt-4 py-3.5 flex items-center justify-center gap-2">
              <Lock size={15} /> Valider et payer ({formatMoney(total)})
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
