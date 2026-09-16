# 📖BookSpace — Frontend Web (React)

Frontend web de la marketplace multi-vendeurs de livres papier & numériques,
généré à partir des maquettes validées (thème « Slate & Sage »).

## Stack

- **React 18** + **Vite**
- **React Router v6** (routing par espace : client / vendeur / admin)
- **Tailwind CSS** — configuré avec les tokens exacts du design system des
  maquettes (`tailwind.config.js`)
- Données mock centralisées dans `src/lib/data.js` (à remplacer par les
  appels à l'API Laravel)

## Installation

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

```bash
npm run build   # build de production dans dist/
npm run preview # prévisualiser le build
```

## Structure du projet

```
src/
  components/
    layout/     → Topbars, Sidebar, Footer (client / vendeur / admin)
    ui/         → BookCover, KpiCard, Stars, Breadcrumb, etc.
    books/      → Cartes livres réutilisables (grille / résultats)
  routes/       → Layouts avec <Outlet/> (ClientLayout, AccountLayout,
                  VendorLayout, AdminLayout)
  pages/
    client/     → 15 pages (accueil, catalogue, fiche produit, panier,
                  paiement, compte, bibliothèque, etc.)
    vendor/     → 8 pages (onboarding KYB, dashboard, catalogue,
                  commandes, gains, paramètres)
    admin/      → 5 pages (dashboard, vérification, modération,
                  commissions, logs de sécurité)
  lib/data.js   → Données mock (livres, commandes, vendeurs...)
```

## Correspondance avec les maquettes PowerPoint

Chaque page reprend fidèlement la structure, les couleurs, la typographie
et les contenus des maquettes validées (`BookSpace_Maquettes_Marketplace.pptx`) :

| Maquette                         | Route React                         |
|-----------------------------------|--------------------------------------|
| Page d'accueil                    | `/`                                  |
| Connexion & inscription           | `/login`                             |
| Catalogue & recherche             | `/catalogue`                         |
| Fiche produit                     | `/livre/:id`                         |
| Panier d'achat hybride            | `/panier`                            |
| Paiement sécurisé                 | `/paiement`                          |
| Suivi de commande                 | `/compte/commandes/:id`              |
| Mon compte & bibliothèque         | `/compte`, `/compte/bibliotheque`    |
| Inscription vendeur (KYB)         | `/vendeur/inscription`               |
| Tableau de bord vendeur           | `/vendeur`                           |
| Ajouter un ouvrage                | `/vendeur/livres/nouveau`            |
| Commandes & versements            | `/vendeur/commandes`, `/vendeur/gains` |
| Supervision admin                 | `/admin`                             |
| Vérification & modération         | `/admin/verification`, `/admin/moderation` |
| Commissions & règles              | `/admin/commissions`                 |

Pages ajoutées pour compléter le parcours (non présentes dans le deck
initial) : confirmation de commande, liste des commandes, liste d'envies,
adresses, paramètres du compte, vitrine publique vendeur, liste des livres
physiques/numériques, paramètres boutique, journaux de sécurité, page 404.

## Prochaine étape

Connecter ces pages à l'API Laravel (remplacer `src/lib/data.js` par des
appels `fetch`/`axios` vers les endpoints REST, gérer l'authentification,
etc.).
