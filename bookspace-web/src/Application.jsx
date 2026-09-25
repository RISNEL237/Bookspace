import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAdmin, RequireApprovedSeller, RequireClient } from "./components/auth/RouteGuards";
const EmailConfirmed = lazy(() => import("./pages/EmailConfirmed"));

const DispositionClient = lazy(() => import("./routes/DispositionClient"));
const DispositionCompte = lazy(() => import("./routes/DispositionCompte"));
const DispositionVendeur = lazy(() => import("./routes/DispositionVendeur"));
const DispositionAdmin = lazy(() => import("./routes/DispositionAdmin"));

// client
const Accueil = lazy(() => import("./pages/client/Accueil"));
const Connexion = lazy(() => import("./pages/client/Connexion"));
const Catalogue = lazy(() => import("./pages/client/Catalogue"));
const FicheProduit = lazy(() => import("./pages/client/FicheProduit"));
const Panier = lazy(() => import("./pages/client/Panier"));
const Paiement = lazy(() => import("./pages/client/Paiement"));
const ConfirmationCommande = lazy(() => import("./pages/client/ConfirmationCommande"));
const VitrineVendeur = lazy(() => import("./pages/client/VitrineVendeur"));
const CarteLibrairies = lazy(() => import("./pages/client/CarteLibrairies"));
const CarnetsCritiques = lazy(() => import("./pages/client/CarnetsCritiques"));
const TableauDeBordCompte = lazy(() => import("./pages/client/TableauDeBordCompte"));
const ListeCommandesClient = lazy(() => import("./pages/client/ListeCommandesClient"));
const SuiviCommande = lazy(() => import("./pages/client/SuiviCommande"));
const BibliothequeNumerique = lazy(() => import("./pages/client/BibliothequeNumerique"));
const ListeEnvies = lazy(() => import("./pages/client/ListeEnvies"));
const Adresses = lazy(() => import("./pages/client/Adresses"));
const ParametresCompte = lazy(() => import("./pages/client/ParametresCompte"));
const Notifications = lazy(() => import("./pages/client/Notifications"));

// vendor
const InscriptionVendeur = lazy(() => import("./pages/vendeur/InscriptionVendeur"));
const TableauDeBordVendeur = lazy(() => import("./pages/vendeur/TableauDeBordVendeur"));
const LivresPhysiquesVendeur = lazy(() => import("./pages/vendeur/LivresPhysiquesVendeur"));
const LivresNumeriquesVendeur = lazy(() => import("./pages/vendeur/LivresNumeriquesVendeur"));
const AjouterLivre = lazy(() => import("./pages/vendeur/AjouterLivre"));
const CommandesVendeur = lazy(() => import("./pages/vendeur/CommandesVendeur"));
const GainsVendeur = lazy(() => import("./pages/vendeur/GainsVendeur"));
const ParametresBoutique = lazy(() => import("./pages/vendeur/ParametresBoutique"));

// admin
const TableauDeBordAdmin = lazy(() => import("./pages/admin/TableauDeBordAdmin"));
const VerificationVendeurs = lazy(() => import("./pages/admin/VerificationVendeurs"));
const Moderation = lazy(() => import("./pages/admin/Moderation"));
const Commissions = lazy(() => import("./pages/admin/Commissions"));
const JournauxSecurite = lazy(() => import("./pages/admin/JournauxSecurite"));

const PageIntrouvable = lazy(() => import("./pages/PageIntrouvable"));

// Composant racine : déclare toutes les routes (URLs) du site
// et associe chaque URL à la page (composant) qui doit s'afficher.
export default function Application() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted">Chargement…</div>}>
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
      <Route path="/auth/confirmed" element={<EmailConfirmed />} />

      {/* Espace compte client */}
      <Route element={<RequireClient />}>
        <Route path="/compte" element={<DispositionCompte />}>
          <Route index element={<TableauDeBordCompte />} />
          <Route path="commandes" element={<ListeCommandesClient />} />
          <Route path="commandes/:id" element={<SuiviCommande />} />
          <Route path="bibliotheque" element={<BibliothequeNumerique />} />
          <Route path="envies" element={<ListeEnvies />} />
          <Route path="adresses" element={<Adresses />} />
          <Route path="parametres" element={<ParametresCompte />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="/vendeur/inscription" element={<InscriptionVendeur />} />
      </Route>

      {/* Espace vendeur */}
      <Route element={<RequireApprovedSeller />}>
        <Route path="/vendeur" element={<DispositionVendeur />}>
          <Route index element={<TableauDeBordVendeur />} />
          <Route path="livres-physiques" element={<LivresPhysiquesVendeur />} />
          <Route path="livres-numeriques" element={<LivresNumeriquesVendeur />} />
          <Route path="livres/nouveau" element={<AjouterLivre />} />
          <Route path="commandes" element={<CommandesVendeur />} />
          <Route path="gains" element={<GainsVendeur />} />
          <Route path="parametres" element={<ParametresBoutique />} />
        </Route>
      </Route>

      {/* Espace administrateur */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<DispositionAdmin />}>
          <Route index element={<TableauDeBordAdmin />} />
          <Route path="verification" element={<VerificationVendeurs />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="logs" element={<JournauxSecurite />} />
        </Route>
      </Route>

      <Route path="*" element={<PageIntrouvable />} />
      </Routes>
    </Suspense>
  );
}
