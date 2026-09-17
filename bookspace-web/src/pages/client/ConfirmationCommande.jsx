import React from "react";
import { Link } from "react-router-dom";
import { articlesPanier } from "../../lib/donnees";
import { BookOpen, PackageSearch } from "lucide-react";

// PAGE : Confirmation de commande (/commande/confirmation)
// Affichée juste après un paiement réussi.
export default function ConfirmationCommande() {
  const total = articlesPanier.reduce((s, i) => s + i.price * i.qty + i.shipping, 0);
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-[560px] w-full text-center">
        <div className="w-16 h-16 rounded-full bg-success-bg text-success flex items-center justify-center text-3xl mx-auto mb-6">
          ✓
        </div>
        <div className="section-title mb-2">Merci, votre commande est confirmée</div>
        <div className="text-muted text-sm mb-8">
          Un e-mail de confirmation a été envoyé. Votre article numérique est
          déjà disponible dans votre bibliothèque.
        </div>

        <div className="card text-left mb-6">
          <div className="flex justify-between text-sm py-2 border-b border-border">
            <span className="text-muted">Numéro de commande</span>
            <span className="font-bold">#CMD-2025-0842</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-border">
            <span className="text-muted">Montant réglé</span>
            <span className="font-bold">{total.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-muted">Livraison estimée</span>
            <span className="font-bold">21 février 2025</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/compte/bibliotheque" className="btn-accent flex items-center gap-2">
              <BookOpen size={16} />
              <span>Ouvrir ma bibliothèque</span>
          </Link>
          <Link to="/compte/commandes" className="btn-outline flex items-center gap-2">
              <PackageSearch size={16} className="text-current" />
              <span>Suivre ma commande</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
