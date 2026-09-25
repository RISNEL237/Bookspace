# 📚 Bookspace

<img src="bookspace-web/public/logo.png" >
> **Marketplace hybride et multi-vendeurs dédiée à la vente de livres physiques et numériques.**

Bookspace est une plateforme de commerce électronique spécialisée dans la vente de livres. Elle permet aux clients de découvrir, rechercher et acheter des livres physiques ou numériques auprès de différents vendeurs.

Le projet combine une **application web moderne**, une **API backend Laravel**, une **base de données PostgreSQL/Supabase** et différents services externes pour gérer l'authentification, les paiements, les commandes et la livraison.

---

## ✨ Présentation

Bookspace a pour objectif de créer un espace numérique où :

* 📖 les lecteurs peuvent rechercher et acheter des livres ;
* 🏪 les libraires et vendeurs peuvent proposer leurs ouvrages ;
* 💻 les livres numériques peuvent être achetés et téléchargés ;
* 📦 les livres physiques peuvent être commandés et livrés ;
* 💳 les paiements peuvent être effectués via des services de paiement intégrés ;
* 📍 les adresses et informations de livraison peuvent être gérées ;
* 👨‍💼 les administrateurs peuvent gérer les utilisateurs et les vendeurs ;
* 📊 les vendeurs peuvent suivre leurs commandes et leurs revenus.

---

# 🏗️ Architecture du projet

Le repository contient actuellement deux applications principales :

```text
Bookspace/
│
├── 📁 bookspace-web/
│   └── Frontend React + Vite
│
├── 📁 bookspace-backend/
│   └── Backend Laravel + API
│
├── 📄 bookspace_schema_v2.sql
│   └── Schéma SQL de la base de données
│
├── 📄 .gitignore
└── 📄 README.md
```

### Architecture générale

```text
                    ┌──────────────────────┐
                    │       Client         │
                    │   Navigateur Web     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Bookspace Web     │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                         HTTP / API
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Bookspace Backend   │
                    │ Laravel + PHP        │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌─────────────┐
          │ Supabase / │ │ Paiements  │ │ Services    │
          │ PostgreSQL │ │ / APIs     │ │ externes    │
          └────────────┘ └────────────┘ └─────────────┘
```

---

# 🖥️ Frontend

Le frontend est développé avec :

* ⚛️ **React**
* ⚡ **Vite**
* 🎨 CSS
* 🧭 React Router
* 🧩 Lucide React
* 🔌 API REST
* 🛒 Gestion du panier côté client

### Dossier

```text
bookspace-web/
```

### Principales fonctionnalités

Le frontend contient notamment :

* 🏠 Accueil
* 📚 Catalogue
* 🔎 Recherche de livres
* 📖 Fiche produit
* 🛒 Panier
* 💳 Paiement
* 📦 Confirmation de commande
* 🚚 Suivi de commande
* 👤 Compte client
* 📍 Gestion des adresses
* 🗺️ Carte des librairies
* 📚 Bibliothèque numérique
* 🏪 Vitrine vendeur
* 📊 Tableau de bord vendeur
* 💰 Gestion des gains vendeur
* 📦 Gestion des commandes vendeur
* 👨‍💼 Administration
* ✅ Vérification des vendeurs

---

# ⚙️ Backend

Le backend est développé avec **Laravel** et expose les fonctionnalités nécessaires au fonctionnement de la marketplace.

### Dossier

```text
bookspace-backend/
```

### Principaux contrôleurs

```text
app/Http/Controllers/
├── AddressController.php
├── BookController.php
├── DigitalLibraryController.php
├── OrderController.php
├── PaymentController.php
├── PayoutController.php
├── ProfileController.php
├── SellerController.php
└── WishlistController.php
```

Une API dédiée est également disponible dans :

```text
routes/api.php
```

### Modèles principaux

```text
app/Models/
├── Address.php
├── Book.php
├── Category.php
├── Client.php
├── DigitalLibraryEntry.php
├── Offer.php
├── Order.php
├── OrderItem.php
├── Payment.php
├── Payout.php
├── Seller.php
├── User.php
└── Wishlist.php
```

---

# 🗄️ Base de données

Le projet utilise une base de données relationnelle.

Le schéma SQL est disponible à la racine :

```text
bookspace_schema_v2.sql
```

Le projet peut notamment être utilisé avec **PostgreSQL via Supabase**.

Les principales données concernent :

* utilisateurs ;
* clients ;
* vendeurs ;
* livres ;
* catégories ;
* offres ;
* commandes ;
* articles de commande ;
* paiements ;
* reversements ;
* adresses ;
* bibliothèque numérique ;
* favoris.

---

# 👥 Types d'utilisateurs

Bookspace repose sur plusieurs rôles.

### 👤 Client

Le client peut :

* créer un compte ;
* parcourir le catalogue ;
* rechercher des livres ;
* ajouter des livres au panier ;
* passer des commandes ;
* effectuer des paiements ;
* gérer ses adresses ;
* suivre ses commandes ;
* accéder à ses livres numériques ;
* gérer ses favoris.

### 🏪 Vendeur

Le vendeur peut :

* créer une demande pour devenir vendeur ;
* gérer ses livres ;
* gérer ses offres ;
* consulter ses commandes ;
* suivre ses revenus ;
* gérer les informations de sa boutique.

### 👨‍💼 Administrateur

L'administrateur peut notamment :

* gérer les utilisateurs ;
* vérifier les demandes de vendeurs ;
* accepter ou refuser un vendeur ;
* superviser les activités de la plateforme ;
* gérer les différents éléments administratifs.

---

# 📚 Livres physiques et numériques

Bookspace est conçu comme une marketplace **hybride**.

## 📦 Livres physiques

Pour un livre physique :

```text
Sélection du livre
        ↓
Ajout au panier
        ↓
Commande
        ↓
Paiement
        ↓
Préparation
        ↓
Livraison / retrait
        ↓
Commande livrée
```

Les informations nécessaires à la livraison peuvent notamment comprendre :

* adresse ;
* localisation ;
* point de rencontre ;
* vendeur ;
* distance ;
* frais de livraison.

## 💻 Livres numériques

Pour un livre numérique :

```text
Sélection
   ↓
Paiement
   ↓
Validation
   ↓
Ajout à la bibliothèque numérique
   ↓
Téléchargement / consultation
```

---

# 💳 Paiements

L'architecture de Bookspace prévoit l'intégration de services de paiement permettant notamment de prendre en charge les paiements mobiles et autres moyens de paiement disponibles.

Les intégrations de paiement sont conçues pour être séparées de la logique métier principale afin de faciliter l'ajout ou le remplacement d'un fournisseur.

> ⚠️ Les clés API, secrets, mots de passe et variables d'environnement ne doivent jamais être publiés sur GitHub.

---

# 🔐 Sécurité

Le projet prend en compte plusieurs mécanismes de sécurité :

* authentification ;
* gestion des sessions/tokens ;
* validation des données ;
* protection des routes ;
* gestion des rôles ;
* séparation des variables d'environnement ;
* protection des informations sensibles ;
* vérification des vendeurs.

Les variables sensibles doivent être placées dans un fichier `.env`.

Un exemple de configuration est fourni avec :

```text
bookspace-backend/.env.example
```

---

# 🚀 Installation

## 1. Cloner le repository

```bash
git clone https://github.com/RISNEL237/Bookspace.git
```

Puis :

```bash
cd Bookspace
```

---

# 🖥️ Installation du frontend

Entrer dans le dossier :

```bash
cd bookspace-web
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Le frontend sera alors accessible sur l'adresse indiquée par Vite dans le terminal.

---

# ⚙️ Installation du backend

Depuis la racine du projet :

```bash
cd bookspace-backend
```

Installer les dépendances PHP :

```bash
composer install
```

Installer les dépendances JavaScript du backend si nécessaire :

```bash
npm install
```

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Sous Windows PowerShell, vous pouvez utiliser :

```powershell
Copy-Item .env.example .env
```

Générer la clé Laravel :

```bash
php artisan key:generate
```

Configurer ensuite les paramètres de connexion à la base de données dans :

```text
.env
```

Puis lancer le serveur :

```bash
php artisan serve
```

---

# 🗃️ Configuration de la base de données

Le fichier :

```text
bookspace_schema_v2.sql
```

contient le schéma SQL utilisé pour la base de données.

Selon l'environnement choisi, le schéma peut être exécuté depuis l'outil SQL correspondant.

Pour Supabase, le SQL peut notamment être exécuté depuis :

```text
Supabase Dashboard
→ SQL Editor
→ New query
→ Coller le contenu du fichier SQL
→ Run
```

---

# 🔑 Variables d'environnement

Ne jamais publier directement les secrets.

Exemple :

```env
APP_NAME=Bookspace
APP_ENV=local
APP_KEY=
APP_DEBUG=true

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

SUPABASE_URL=
SUPABASE_KEY=

PAYMENT_API_KEY=
PAYMENT_SECRET=
```

Les valeurs réelles doivent rester dans `.env`.

---

# 🧪 Tests

Le backend contient des tests automatisés dans :

```text
bookspace-backend/tests/
```

Exemples :

```text
tests/
├── Feature/
│   ├── CatalogApiTest.php
│   ├── OrderApiTest.php
│   └── ExampleTest.php
│
└── Unit/
    └── ExampleTest.php
```

Pour lancer les tests :

```bash
php artisan test
```

---

# 🛠️ Technologies utilisées

| Domaine             | Technologie           |
| ------------------- | --------------------- |
| Frontend            | React                 |
| Build frontend      | Vite                  |
| Backend             | Laravel               |
| Langage backend     | PHP                   |
| Base de données     | PostgreSQL / Supabase |
| API                 | REST                  |
| Styling             | CSS                   |
| Icônes              | Lucide React          |
| Gestion de versions | Git / GitHub          |
| Tests               | PHPUnit / Pest        |
| Déploiement         | À définir             |

---

# 📁 Organisation du repository

```text
Bookspace/
│
├── bookspace-web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── bookspace-backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── composer.json
│   └── artisan
│
├── bookspace_schema_v2.sql
├── .gitignore
└── README.md
```

---

# 🔄 Workflow Git

Pour récupérer les dernières modifications :

```bash
git pull origin main
```

Après une modification :

```bash
git add .
```

Créer un commit :

```bash
git commit -m "description de la modification"
```

Puis envoyer vers GitHub :

```bash
git push origin main
```

---

# 🗺️ Roadmap

### Phase 1 — Fondation

* [x] Création du frontend
* [x] Création du backend
* [x] Mise en place du repository GitHub
* [x] Première architecture de la base de données
* [x] API backend initiale
* [x] Interface utilisateur initiale

### Phase 2 — Fonctionnalités principales

* [x] Catalogue
* [x] Fiches produits
* [x] Panier
* [x] Gestion des commandes
* [x] Gestion des vendeurs
* [x] Tableau de bord client
* [x] Tableau de bord vendeur
* [x] Administration

### Phase 3 — Intégrations

* [ ] Connexion complète frontend ↔ API
* [ ] Authentification complète
* [ ] Configuration Supabase
* [ ] Intégration du paiement
* [ ] Gestion complète des téléchargements numériques
* [ ] Gestion de la livraison
* [ ] Notifications email

### Phase 4 — Production

* [ ] Tests complets
* [ ] Optimisation des performances
* [ ] Sécurisation de la production
* [ ] Déploiement frontend
* [ ] Déploiement backend
* [ ] Configuration du domaine
* [ ] Monitoring

---

# 📸 Aperçu

> Les captures d'écran de l'application pourront être ajoutées ici au fur et à mesure de l'avancement du projet.

```text
/screenshots/
├── accueil.png
├── catalogue.png
├── produit.png
├── panier.png
├── paiement.png
├── vendeur.png
└── administration.png
```

---

# 🤝 Contribution

Les contributions sont les bienvenues.

Pour contribuer :

```bash
git clone https://github.com/RISNEL237/Bookspace.git
cd Bookspace
```

Créer ensuite une branche :

```bash
git checkout -b feature/ma-fonctionnalite
```

Effectuer les modifications, puis :

```bash
git add .
git commit -m "feat: ajout de ma fonctionnalité"
git push origin feature/ma-fonctionnalite
```

Une Pull Request peut ensuite être ouverte sur GitHub.

---

# 📄 Licence

Le projet est actuellement en développement.

Les conditions de licence et d'utilisation seront précisées ultérieurement.

---

# 👨‍💻 Auteur

**Risnel Talla**

Étudiant en génie logiciel et développeur web.

* GitHub : https://github.com/RISNEL237/
* LinkedIn : https://www.linkedin.com/in/risnel-talla-521280395/

---

# 📌 Statut du projet

🚧 **Bookspace est actuellement en développement.**

L'objectif est de construire progressivement une marketplace complète permettant la mise en relation entre lecteurs, libraires et vendeurs indépendants autour de la vente de livres physiques et numériques.

---

## 📚 Bookspace

**Discover. Buy. Read. Share.**

> *Une nouvelle manière de découvrir et d'acheter des livres.*
