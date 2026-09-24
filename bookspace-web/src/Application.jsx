import React from "react";
import { Routes, Route } from "react-router-dom";

import DispositionClient from "./routes/DispositionClient";
import DispositionCompte from "./routes/DispositionCompte";
import DispositionVendeur from "./routes/DispositionVendeur";
import DispositionAdmin from "./routes/DispositionAdmin";

// client
import Accueil from "./pages/client/Accueil";
import Connexion from "./pages/client/Connexion";
import Catalogue from "./pages/client/Catalogue";
import FicheProduit from "./pages/client/FicheProduit";
import Panier from "./pages/client/Panier";
import Paiement from "./pages/client/Paiement";
import ConfirmationCommande from "./pages/client/ConfirmationCommande";
import VitrineVendeur from "./pages/client/VitrineVendeur";
import CarteLibrairies from "./pages/client/CarteLibrairies";
import CarnetsCritiques from "./pages/client/CarnetsCritiques";
import TableauDeBordCompte from "./pages/client/TableauDeBordCompte";
import ListeCommandesClient from "./pages/client/ListeCommandesClient";
import SuiviCommande from "./pages/client/SuiviCommande";
import BibliothequeNumerique from "./pages/client/BibliothequeNumerique";
import ListeEnvies from "./pages/client/ListeEnvies";
import Adresses from "./pages/client/Adresses";
import ParametresCompte from "./pages/client/ParametresCompte";

// vendor
import InscriptionVendeur from "./pages/vendeur/InscriptionVendeur";
import TableauDeBordVendeur from "./pages/vendeur/TableauDeBordVendeur";
import LivresPhysiquesVendeur from "./pages/vendeur/LivresPhysiquesVendeur";
import LivresNumeriquesVendeur from "./pages/vendeur/LivresNumeriquesVendeur";
import AjouterLivre from "./pages/vendeur/AjouterLivre";
import CommandesVendeur from "./pages/vendeur/CommandesVendeur";
import GainsVendeur from "./pages/vendeur/GainsVendeur";
import ParametresBoutique from "./pages/vendeur/ParametresBoutique";

// admin
import TableauDeBordAdmin from "./pages/admin/TableauDeBordAdmin";
import VerificationVendeurs from "./pages/admin/VerificationVendeurs";
import Moderation from "./pages/admin/Moderation";
import Commissions from "./pages/admin/Commissions";
import JournauxSecurite from "./pages/admin/JournauxSecurite";

import PageIntrouvable from "./pages/PageIntrouvable";

// Composant racine : déclare toutes les routes (URLs) du site
// et associe chaque URL à la page (composant) qui doit s'afficher.
export default function Application() {
  return (
    <Routes>
      {/* Espace public / client */}
      <Route element={<DispositionClient />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/livre/:id" element={<FicheProduit />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/commande/confirmation" element={<ConfirmationCommande />} />
        <Route path="/librairie/:id" element={<VitrineVendeur />} />
        <Route path="/librairies" element={<CarteLibrairies />} />
        <Route path="/carnets-critiques" element={<CarnetsCritiques />} />
      </Route>

      <Route path="/login" element={<Connexion />} />

      {/* Espace compte client */}
      <Route path="/compte" element={<DispositionCompte />}>
        <Route index element={<TableauDeBordCompte />} />
        <Route path="commandes" element={<ListeCommandesClient />} />
        <Route path="commandes/:id" element={<SuiviCommande />} />
        <Route path="bibliotheque" element={<BibliothequeNumerique />} />
        <Route path="envies" element={<ListeEnvies />} />
        <Route path="adresses" element={<Adresses />} />
        <Route path="parametres" element={<ParametresCompte />} />
      </Route>

      {/* Espace vendeur */}
      <Route path="/vendeur/inscription" element={<InscriptionVendeur />} />
      <Route path="/vendeur" element={<DispositionVendeur />}>
        <Route index element={<TableauDeBordVendeur />} />
        <Route path="livres-physiques" element={<LivresPhysiquesVendeur />} />
        <Route path="livres-numeriques" element={<LivresNumeriquesVendeur />} />
        <Route path="livres/nouveau" element={<AjouterLivre />} />
        <Route path="commandes" element={<CommandesVendeur />} />
        <Route path="gains" element={<GainsVendeur />} />
        <Route path="parametres" element={<ParametresBoutique />} />
      </Route>

      {/* Espace administrateur */}
      <Route path="/admin" element={<DispositionAdmin />}>
        <Route index element={<TableauDeBordAdmin />} />
        <Route path="verification" element={<VerificationVendeurs />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="commissions" element={<Commissions />} />
        <Route path="logs" element={<JournauxSecurite />} />
      </Route>

      <Route path="*" element={<PageIntrouvable />} />
    </Routes>
  );
}
