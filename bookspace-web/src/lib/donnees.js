// le fichier presente les donnees mocks

// Liste des identifiants de couverture disponibles (styles de fond)
export const couvertures = ["cv1", "cv2", "cv3", "cv4", "cv5", "cv6"];

// Dégradés de couleur associés à chaque identifiant de couverture
// (utilisé par le composant CouvertureLivre pour simuler une jaquette)
export const stylesCouvertures = {
  cv1: "from-[#3B4B41] to-[#26332C]",
  cv2: "from-[#5C7DA0] to-[#3D5876]",
  cv3: "from-[#B98A2E] to-[#8E6A1F]",
  cv4: "from-[#5A7D63] to-[#3F5A47]",
  cv5: "from-[#8A5A56] to-[#6B413D]",
  cv6: "from-[#6B6350] to-[#4A4434]",
};

// Catalogue principal des livres (papier + numérique)
export const livres = [
  {
    id: "memoires-ombre",
    title: "Les Mémoires de l'Ombre",
    author: "Madeleine de Varenne",
    cover: "cv1",
    genre: "Roman historique",
    rating: 4.9,
    reviews: 1420,
    pricePaper: 19.99,
    priceEbook: 9.99,
    seller: "Librairie Delamain",
    sellerCity: "Paris 1er",
    isbn: "978-2-339-18492-7",
    pages: 432,
    published: "12 Oct. 2024",
    synopsis:
      "À l'automne 1913, au cœur des corridors capitonnés de la bibliothèque impériale de Prague, Éléonore de Valmont exhume un codex que l'on croyait réduit en cendres. Poursuivie par une confrérie d'érudits dissidents, la jeune archiviste se lance dans une traversée clandestine à travers les couvents oubliés de Bohême.",
  },
  {
    id: "archipel-songes",
    title: "L'Archipel des Songes",
    author: "Sylvie Dubois",
    cover: "cv2",
    genre: "Roman contemporain",
    rating: 4.5,
    reviews: 940,
    pricePaper: 22.0,
    priceEbook: 11.99,
    seller: "Éditions Horizon Bleu",
    sellerCity: "Distribution directe",
    isbn: "978-2-07-045213-9",
    pages: 288,
    published: "03 Sept. 2024",
    synopsis:
      "Une traversée insulaire où chaque île révèle un fragment de mémoire familiale enfouie, entre rêve éveillé et quête des origines.",
  },
  {
    id: "lumieres-aube",
    title: "Lumières de l'Aube",
    author: "Antoine de Saint-Marc",
    cover: "cv3",
    genre: "Philosophie",
    rating: 4.7,
    reviews: 610,
    pricePaper: 16.5,
    priceEbook: 8.49,
    seller: "Librairie de l'Odéon",
    sellerCity: "Paris 6e",
    isbn: "978-2-234-08812-3",
    pages: 214,
    published: "22 Janv. 2024",
    synopsis:
      "Un essai lumineux sur la persistance de l'espérance à travers les grandes ruptures historiques du XXe siècle.",
  },
  {
    id: "geometries-silencieuses",
    title: "Géométries Silencieuses",
    author: "Clara Benetti",
    cover: "cv4",
    genre: "Poésie",
    rating: 4.8,
    reviews: 388,
    pricePaper: 28.0,
    priceEbook: 14.99,
    seller: "Atelier Typographique Voltaire",
    sellerCity: "Genève, CH",
    isbn: "978-2-330-09921-7",
    pages: 96,
    published: "14 Mai 2024",
    synopsis:
      "Un tirage limité et une composition typographique soignée pour ce recueil sur les formes silencieuses du quotidien.",
  },
  {
    id: "sentier-alizes",
    title: "Le Sentier des Alizés",
    author: "Hugo Ferrand",
    cover: "cv5",
    genre: "Roman d'aventure",
    rating: 4.4,
    reviews: 275,
    pricePaper: 17.9,
    priceEbook: 9.4,
    seller: "Librairie Delamain",
    sellerCity: "Paris 1er",
    isbn: "978-2-253-04471-2",
    pages: 356,
    published: "10 Juin 2024",
  },
  {
    id: "traite-esthetique",
    title: "Traité d'Esthétique & Typographie",
    author: "Antoine de Saint-Marc",
    cover: "cv6",
    genre: "Essai",
    rating: 4.6,
    reviews: 190,
    pricePaper: 18.4,
    priceEbook: 12.9,
    seller: "Atelier Typographique Voltaire",
    sellerCity: "Genève, CH",
    isbn: "978-2-84682-611-0",
    pages: 268,
    published: "02 Déc. 2023",
  },
];

// Contenu du panier d'achat (page Panier + Paiement)
// On réutilise un livre du catalogue (...livres[0])
export const articlesPanier = [
  {
    ...livres[0],
    format: "Livre broché",
    qty: 1,
    price: 19.99,
    shipping: 3.5,
  },
  {
    ...livres[1],
    format: "E-pub — instantané",
    qty: 1,
    price: 9.99,
    shipping: 0,
  },
];

// Historique des commandes du client connecté (espace "Mon compte")
export const commandesClient = [
  {
    id: "CMD-2025-0841",
    book: livres[0],
    date: "Aujourd'hui, 09:30",
    seller: "Librairie Delamain, Paris",
    status: "En préparation",
    statusTone: "warning",
  },
  {
    id: "CMD-2025-0792",
    book: livres[5],
    date: "12 février 2025",
    seller: "Atelier Typographique Voltaire, Genève",
    status: "Expédié",
    statusTone: "info",
  },
  {
    id: "CMD-2025-0610",
    book: livres[2],
    date: "28 janvier 2025",
    seller: "Librairie de l'Odéon, Paris",
    status: "Livré",
    statusTone: "success",
  },
];

// Livres numériques déjà achetés par le client (page Bibliothèque numérique)
export const bibliothequeNumerique = [
  { ...livres[0], format: "ePub", size: "3.2 Mo", purchased: "14 Fév. 2025" },
  { ...livres[1], format: "ePub", size: "4.5 Mo", purchased: "02 Fév. 2025" },
  { ...livres[5], format: "PDF", size: "18.4 Mo", purchased: "02 Déc. 2024" },
];

// Liste d'envies du client
export const listeEnvies = [livres[3], livres[4], livres[5]];

// Adresses de livraison enregistrées par le client
export const adresses = [
  {
    id: 1,
    label: "Domicile",
    name: "Éléonore de Montalembert",
    line: "14 Rue de l'Odéon",
    city: "75006 Paris, France",
    isDefault: true,
  },
  {
    id: 2,
    label: "Bureau",
    name: "Éléonore de Montalembert",
    line: "8 Avenue des Lettres",
    city: "75008 Paris, France",
    isDefault: false,
  },
];


// Donnees côté VENDEUR

// Commandes physiques que le vendeur doit préparer/expédier
export const commandesVendeur = [
  { id: "CMD-0841", client: "É. de Montalembert", title: "Les Mémoires de l'Ombre", shipping: "Colissimo", status: "En attente", tone: "warning" },
  { id: "CMD-0839", client: "Marc V.", title: "Traité d'Esthétique", shipping: "Colissimo", status: "Étiquette prête", tone: "success" },
  { id: "CMD-0834", client: "Camille D.", title: "Lumières de l'Aube", shipping: "Click & Collect", status: "Prêt retrait", tone: "info" },
  { id: "CMD-0822", client: "Julien B.", title: "Géométries Silencieuses", shipping: "Colissimo", status: "En préparation", tone: "muted" },
];

// Catalogue "papier" du vendeur, avec son propre stock
export const livresPhysiquesVendeur = [
  { ...livres[0], stock: 15, format: "Broché" },
  { ...livres[4], stock: 8, format: "Broché" },
];

// Catalogue "numérique" du vendeur, avec le nombre de téléchargements
export const livresNumeriquesVendeur = [
  { ...livres[0], format: "ePub", downloads: 142 },
  { ...livres[5], format: "PDF", downloads: 34 },
];

// Historique des versements bancaires reçus par le vendeur
export const versements = [
  { label: "Versement février", date: "15 fév. 2025", amount: "1 090 €", status: "done" },
  { label: "Versement janvier", date: "15 janv. 2025", amount: "980 €", status: "done" },
  { label: "Versement mars", date: "Prévu le 15 mars 2025", amount: "1 245 €", status: "pending" },
];


// Donnees côté ADMINISTRATEUR

// Vendeurs en attente de validation (vérification KYB)
export const vendeursEnAttente = [
  { name: "Librairie de l'Odéon", type: "SARL — Librairie indépendante", country: "France", siret: "412 890 00021", docs: ["RIB conforme", "CNI gérant", "Kbis"] },
  { name: "Éditions du Marais", type: "SASU — Maison d'édition", country: "Belgique", siret: "BCE 0892.441.902", docs: ["RIB conforme", "Passeport UE (en attente)"] },
  { name: "Atelier Typographique Voltaire", type: "Association agréée", country: "Suisse", siret: "CHE-109.841.220", docs: ["RIB (IBAN)", "Permis / CNI", "Statuts (en attente)"] },
];

// Signalements d'abus / contrefaçon à traiter par la modération
export const signalements = [
  { id: "OFF-9042", title: "Les Mémoires de l'Ombre (ePub)", reason: "Fichier corrompu / tatouage DRM non conforme", reporter: "editions.officiel@…", date: "Aujourd'hui, 08:42" },
  { id: "OFF-8812", title: "Rare Manuscrit 1884", reason: "Prix suspect : écart de -75% vs estimation Loi Lang", reporter: "Auditeur automatique", date: "Hier, 19:15" },
];

// Journal des actions sensibles effectuées sur la plateforme (audit)
export const journauxSecurite = [
  { actor: "Super-Admin #001", action: "Modification commission livres numériques (18% → 20%)", date: "Il y a 4 jours", ip: "194.214.73.12" },
  { actor: "Super-Admin #002", action: "Activation du palier dégressif librairies", date: "12 févr. 2025", ip: "84.14.92.10" },
  { actor: "Système", action: "Validation KYB automatique — Librairie Delamain", date: "10 févr. 2025", ip: "—" },
  { actor: "Super-Admin #001", action: "Rejet dossier vendeur — documents non conformes", date: "08 févr. 2025", ip: "194.214.73.12" },
];
