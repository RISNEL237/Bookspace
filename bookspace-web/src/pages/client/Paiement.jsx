import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../../lib/cart";
import { createMobileMoneyPayment, createOrder, formatMoney } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { Lock, Smartphone } from "lucide-react";

const methodes = [
  { id: "mtn", label: "MTN MoMo", active: true },
  { id: "orange", label: "Orange Money", active: false },
  { id: "paypal", label: "PayPal", active: false },
];

export default function Paiement() {
  const navigate = useNavigate();
  const [methode, setMethode] = useState("mtn");
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const articles = getCartItems();
  const total = articles.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1) + Number(item.shipping || 0), 0);

  async function payer(event) {
    event.preventDefault(); setErreur(""); setEnvoi(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate("/login", { state: { retour: "/paiement" } }); return; }
      if (!methodes.find((item) => item.id === methode)?.active) throw new Error("Ce moyen de paiement n'est pas encore configuré.");
      if (articles.some((item) => !item.sellerId || !item.offerId)) throw new Error("Une offre ou un vendeur du panier est manquant.");
      const order = await createOrder(articles, "mtn_momo", telephone);
      const payment = await createMobileMoneyPayment(order.id, "mtn", telephone);
      navigate("/commande/confirmation", { state: { commande: order, paiement: payment } });
    } catch (error) { setErreur(error.message || "Le paiement n'a pas pu être initialisé."); } finally { setEnvoi(false); }
  }

  return <div><div className="bg-primary text-white px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3"><span className="font-head font-bold">Book<span className="text-accent">Space</span></span><span className="text-white/70 text-xs">Paiement · Cameroun</span><span className="ml-auto">XAF</span></div>
    <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-10 pt-6 pb-10"><form onSubmit={payer} className="flex-[1.5]"><div className="card mb-5"><div className="card-title">Moyen de paiement</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">{methodes.map((method) => <button type="button" key={method.id} disabled={!method.active} onClick={() => setMethode(method.id)} className={`border rounded-lg p-3 text-sm font-bold disabled:opacity-45 disabled:cursor-not-allowed ${methode === method.id ? "border-accent bg-accent-pale" : "border-border"}`}><Smartphone size={18} className="mx-auto mb-1" />{method.label}{!method.active && <span className="block text-[10px] font-normal mt-1">À configurer</span>}</button>)}</div>
      <div className="field"><label htmlFor="telephone">Numéro MTN MoMo</label><input id="telephone" className="input" type="tel" placeholder="+237 6 XX XX XX XX" value={telephone} onChange={(event) => setTelephone(event.target.value)} required /></div><div className="text-muted text-xs">Le serveur recalculera le total à partir des offres actuelles avant d'initialiser le paiement.</div></div>
      {erreur && <div role="alert" className="bg-danger-bg text-danger rounded-lg p-3 mb-4 text-sm">{erreur}</div>}
      <button type="submit" disabled={envoi || articles.length === 0} className="btn-accent w-full py-4 disabled:opacity-50"><Lock size={15} className="inline mr-1.5" />{envoi ? "Initialisation…" : `Payer ${formatMoney(total)}`}</button>
    </form><div className="flex-1"><div className="card"><div className="card-title">Récapitulatif ({articles.length} article(s))</div>{articles.map((item) => <div key={`${item.offerId}-${item.format}`} className="flex gap-3 items-center py-2.5 border-b border-border last:border-0"><CouvertureLivre graine={item.id} cover={item.cover} className="w-9 h-12 shrink-0" /><div className="flex-1"><div className="text-sm font-bold">{item.title}</div><div className="text-faint text-xs">{item.seller} · Qté {item.qty}</div></div><div className="text-sm font-bold">{formatMoney(Number(item.price) * Number(item.qty))}</div></div>)}<div className="flex justify-between pt-3 mt-2 border-t border-border font-bold"><span>Sous-total affiché</span><span>{formatMoney(total)}</span></div><div className="text-faint text-xs mt-3">Les frais de livraison à domicile ne sont pas inclus tant que le barème par ville et poids n'est pas configuré.</div></div></div></div>
  </div>;
}
