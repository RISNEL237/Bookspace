import React from "react";
import { listeEnvies } from "../../lib/donnees";
import { CarteLivreGrille } from "../../components/livres/CartesLivres";

// PAGE : Liste d'envies (/compte/envies)
export default function ListeEnvies() {
  return (
    <div>
      <div className="section-title mb-1">Liste d'envies</div>
      <div className="text-muted text-sm mb-6">
        {listeEnvies.length} titres enregistrés — recevez une alerte en cas de
        baisse de prix ou de réédition.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {listeEnvies.map((b) => (
          <CarteLivreGrille key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}
