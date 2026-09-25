import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clearCart, getCartItems } from "../../lib/cart";
import { fetchMobileMoneyStatus, fetchOrderById } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { CheckCircle2, FileText, Printer, BookOpen, QrCode, MapPin, Smartphone, Download, PiggyBank } from "lucide-react";

// PAGE : Confirmation de commande (/commande/confirmation)
// Affichée juste après un paiement réussi. Récapitule la répartition
// papier (retrait) / numérique (accès immédiat) et la transparence
// financière de la transaction.
export default function ConfirmationCommande() {
  const location = useLocation();
  const [commande, setCommande] = useState(() => location.state?.commande || null);
  const paiement = location.state?.paiement || null;
  const [statutPaiement, setStatutPaiement] = useState(paiement?.status || location.state?.commande?.status || "pending");
  const [articles, setArticles] = useState(() => getCartItems());

  useEffect(() => {
    const snapshot = getCartItems();
    setArticles(snapshot);
    clearCart();

    const orderId = new URLSearchParams(location.search).get("order_id");
    if (orderId && !commande) {
      fetchOrderById(orderId)
        .then((order) => {
          setCommande(order);
          setStatutPaiement(order.status || "pending");
        })
        .catch(() => {});
    }
  }, [location.search]);

  useEffect(() => {
    if (!paiement?.reference || !commande?.id || statutPaiement !== "pending") {
      return undefined;
    }

    let actif = true;
    const verifier = async () => {
      try {
        const resultat = await fetchMobileMoneyStatus(commande.id, paiement.reference);
        if (actif) setStatutPaiement(resultat.status);
      } catch {
        // Le prochain contrôle pourra récupérer une réponse du fournisseur.
      }
    };

    verifier();
    const intervalle = window.setInterval(verifier, 5000);
    return () => {
      actif = false;
      window.clearInterval(intervalle);
    };
  }, [commande?.id, paiement?.reference, statutPaiement]);

  const total = articles.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1) + Number(i.shipping || 0), 0);
  const papier = articles.filter((a) => !String(a.format || "").toLowerCase().includes("epub") && !String(a.format || "").toLowerCase().includes("pdf"));
  const numerique = articles.filter((a) => String(a.format || "").toLowerCase().includes("epub") || String(a.format || "").toLowerCase().includes("pdf"));

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-[900px] mx-auto">
        <div className="card !bg-success-bg !border-none flex flex-col sm:flex-row items-center gap-4 mb-6 text-center sm:text-left">
          <CheckCircle2 size={40} className="text-success shrink-0" />
          <div className="flex-1">
            <div className="font-head text-xl font-extrabold">Merci pour votre commande littéraire !</div>
            <div className="text-muted text-sm">Votre achat soutient directement nos libraires et éditeurs indépendants partenaires.</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn-outline btn-sm flex items-center gap-1.5"><FileText size={14} /> Facture PDF</button>
            <button className="btn-outline btn-sm flex items-center gap-1.5"><Printer size={14} /> Imprimer</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
          <div className="card !p-3.5"><div className="text-faint mb-1">Référence</div><b>#{commande?.id || "En attente"}</b></div>
          <div className="card !p-3.5"><div className="text-faint mb-1">Date</div><b>{commande?.created_at ? new Date(commande.created_at).toLocaleDateString("fr-FR") : "Aujourd'hui"}</b></div>
          <div className="card !p-3.5"><div className="text-faint mb-1">Notification</div><b className="truncate block">Par e-mail</b></div>
          <div className="card !p-3.5"><div className="text-faint mb-1">Statut du paiement</div><b className={statutPaiement === "paid" ? "text-success" : "text-warning"}>{statutPaiement === "pending" ? "En attente" : statutPaiement === "paid" ? "Payé" : statutPaiement}</b></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {papier.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm flex items-center gap-2"><MapPin size={16} /> Lot Physique · Click & Collect</div>
                <span className="pill-warning">En préparation</span>
              </div>
              {papier.map((a) => (
                <div key={a.id} className="flex gap-3 items-center py-2">
                  <CouvertureLivre graine={a.id} className="w-10 h-14 shrink-0" />
                  <div className="flex-1 text-sm">
                    <div className="font-bold">{a.title}</div>
                    <div className="text-faint text-xs">{a.author}</div>
                  </div>
                </div>
              ))}
              <div className="bg-surfaceAlt rounded-lg p-3.5 mt-3 flex items-center gap-3">
                <QrCode size={36} className="text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-faint">PASS DE RETRAIT</div>
                  <div className="font-bold text-sm">#DLM-7842</div>
                  <div className="text-[11px] text-muted">Présentez ce code en librairie</div>
                </div>
              </div>
            </div>
          )}
          {numerique.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm flex items-center gap-2"><Smartphone size={16} /> Lot Numérique · Accès immédiat</div>
                <span className="pill-success">Prêt à lire</span>
              </div>
              {numerique.map((a) => (
                <div key={a.id} className="flex gap-3 items-center py-2">
                  <CouvertureLivre graine={a.id} className="w-10 h-14 shrink-0" />
                  <div className="flex-1 text-sm">
                    <div className="font-bold">{a.title}</div>
                    <div className="text-faint text-xs">{a.author}</div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <Link to="/compte/bibliotheque" className="btn-accent btn-sm flex-1 flex items-center justify-center gap-1.5">
                  <BookOpen size={14} /> Ouvrir dans le lecteur
                </Link>
                <button className="btn-outline btn-sm flex items-center gap-1.5"><Download size={14} /></button>
              </div>
            </div>
          )}
        </div>

        <div className="card !bg-accent-pale !border-none flex items-center gap-3 mb-6">
          <PiggyBank size={22} className="text-accent-dark shrink-0" />
          <div className="text-sm">
            <b>+{(total * 0.1).toFixed(2)} €</b> ajoutés à votre cagnotte fidélité solidaire — utilisable dès votre prochaine commande.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/compte/bibliotheque" className="btn-accent text-center">Accéder à ma bibliothèque</Link>
          <Link to="/compte/commandes" className="btn-outline text-center">Suivre ma commande</Link>
        </div>
      </div>
    </div>
  );
}
