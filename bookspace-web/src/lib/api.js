import { supabase } from "./supabaseClient";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;

export function formatMoney(amount, currency = "XAF") {
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency, maximumFractionDigits: currency === "XAF" ? 0 : 2 }).format(Number(amount || 0));
}

const normalizeBook = (book = {}) => ({
  id: book.id ?? "",
  title: book.title ?? "Titre indisponible",
  author: book.author ?? "Auteur inconnu",
  genre: book.genre ?? "Divers",
  rating: Number(book.rating ?? 0),
  reviews: Number(book.reviews_count ?? 0),
  pricePaper: Number(book.price_paper ?? 0),
  priceEbook: Number(book.price_ebook ?? 0),
  seller: book.seller?.shop_name ?? "",
  sellerId: book.seller_id ?? book.seller?.id ?? "",
  sellerCity: book.seller?.city ?? "",
  isbn: book.isbn ?? "",
  pages: Number(book.pages ?? 0),
  published: book.published_at ?? "",
  synopsis: book.synopsis ?? "",
  cover: book.cover_style ?? "cv1",
  isPublished: Boolean(book.is_published),
  offers: Array.isArray(book.offers) ? book.offers.map((offer) => ({
    id: offer.id ?? "",
    type: offer.type ?? "physique",
    price: Number(offer.price ?? 0),
    stock: offer.stock == null ? null : Number(offer.stock),
    sellerId: offer.seller_id ?? "",
    seller: offer.seller ?? null,
  })) : [],
});

async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (data.session?.access_token) {
    headers.set("Authorization", `Bearer ${data.session.access_token}`);
  }

  const response = await fetch(apiUrl(path), { ...options, headers });

  if (response.status === 401) {
    throw new Error("Vous devez être connecté pour continuer.");
  }

  return response;
}

export async function createOrder(items, paymentProvider = "mtn_momo", paymentPhone = null) {
  const response = await apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      items: items.map((item) => ({
        offer_id: item.offerId,
        book_id: item.id,
        seller_id: item.sellerId,
        format: item.format,
        quantity: Number(item.qty || 1),
        unit_price: Number(item.price || 0),
        shipping_fee: Number(item.shipping || 0),
      })),
      payment_provider: paymentProvider,
      payment_phone: paymentPhone,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de créer la commande.");
  }

  return response.json();
}

export async function createCheckoutSession(orderId) {
  const response = await apiFetch(`/api/orders/${orderId}/checkout-session`, {
    method: "POST",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'ouvrir le paiement sécurisé.");
  }

  return response.json();
}

export async function createMobileMoneyPayment(orderId, provider, phone) {
  const response = await apiFetch(`/api/orders/${orderId}/mobile-money`, {
    method: "POST",
    body: JSON.stringify({ provider, phone }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'initialiser le paiement mobile.");
  }

  return response.json();
}

export async function fetchMobileMoneyStatus(orderId, reference) {
  const response = await apiFetch(`/api/orders/${orderId}/mobile-money/${reference}`);

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de vérifier le paiement mobile.");
  }

  return response.json();
}

export async function fetchOrders() {
  const response = await apiFetch("/api/orders");

  if (!response.ok) {
    throw new Error("Impossible de charger vos commandes.");
  }

  return response.json();
}

export async function fetchSellerOrders() {
  const response = await apiFetch("/api/seller/orders");

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les commandes vendeur.");
  }

  return response.json();
}

export async function fetchSellerPayouts() {
  const response = await apiFetch("/api/seller/payouts");

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les versements vendeur.");
  }

  return response.json();
}

export async function fetchDigitalLibrary() {
  const response = await apiFetch("/api/library");

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger votre bibliothèque.");
  }

  return response.json();
}

export async function fetchAddresses() {
  const response = await apiFetch("/api/addresses");

  if (!response.ok) {
    throw new Error("Impossible de charger vos adresses.");
  }

  return response.json();
}

export async function fetchDigitalBookDownloadLink(entryId) {
  const response = await apiFetch(`/api/library/${encodeURIComponent(entryId)}/download-link`, { method: "POST" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de créer le lien de téléchargement.");
  }
  return response.json();
}

export async function updateSellerOrderLine(id, status) {
  const response = await apiFetch(`/api/seller/order-lines/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de mettre à jour cette ligne.");
  }
  return response.json();
}

export async function confirmOrderDelivery(orderId, lineId) {
  const response = await apiFetch(`/api/orders/${orderId}/confirm-delivery`, { method: "POST", body: JSON.stringify({ line_id: lineId }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de confirmer la réception.");
  }
  return response.json();
}

export async function fetchWishlist() {
  const response = await apiFetch("/api/wishlist");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger votre liste d'envies.");
  }
  return response.json();
}

export async function addToWishlist(bookId) {
  const response = await apiFetch("/api/wishlist", { method: "POST", body: JSON.stringify({ book_id: bookId }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'ajouter ce livre à vos envies.");
  }
  return response.json();
}

export async function removeFromWishlist(bookId) {
  const response = await apiFetch(`/api/wishlist/${bookId}`, { method: "DELETE" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de retirer ce livre de vos envies.");
  }
}

export async function fetchChronicles() {
  const response = await fetch(apiUrl("/api/chroniques"));
  if (!response.ok) throw new Error("Impossible de charger les chroniques.");
  return response.json();
}

export async function fetchSellerOffers() {
  const response = await apiFetch("/api/seller/offers");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger vos offres.");
  }
  return response.json();
}

export async function createSellerBook(book) {
  const response = await apiFetch("/api/seller/books", { method: "POST", body: JSON.stringify(book) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'ajouter ce livre.");
  }
  return response.json();
}

export async function fetchSellerProfile() {
  const response = await apiFetch("/api/seller/profile");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger votre boutique.");
  }
  return response.json();
}

export async function updateSellerProfile(profile) {
  const response = await apiFetch("/api/seller/profile", { method: "PATCH", body: JSON.stringify(profile) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'enregistrer votre boutique.");
  }
  return response.json();
}

export async function applyAsSeller(application) {
  const response = await apiFetch("/api/seller/apply", { method: "POST", body: JSON.stringify(application) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'envoyer la demande vendeur.");
  }
  return response.json();
}

export async function createAddress(address) {
  const response = await apiFetch("/api/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'ajouter cette adresse.");
  }

  return response.json();
}

export async function updateAddress(id, address) {
  const response = await apiFetch(`/api/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de modifier cette adresse.");
  }

  return response.json();
}

export async function fetchMyProfile() {
  const response = await apiFetch("/api/profile/me");

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger votre profil.");
  }

  const payload = await response.json();
  return payload.user;
}

export async function updateMyProfile(profile) {
  const response = await apiFetch("/api/profile/me", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'enregistrer votre profil.");
  }

  return response.json();
}

export async function fetchOrderById(id) {
  const response = await apiFetch(`/api/orders/${id}`);

  if (!response.ok) {
    throw new Error("Impossible de charger cette commande.");
  }

  return response.json();
}

export async function fetchBooks() {
  const response = await fetch(apiUrl("/api/books"));

  if (!response.ok) {
    throw new Error("Impossible de charger le catalogue");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeBook) : [];
}

export async function fetchNotifications() {
  const response = await apiFetch("/api/notifications");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les notifications.");
  }
  return response.json();
}

export async function markNotificationRead(id) {
  const response = await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de mettre la notification à jour.");
  }
  return response.json();
}

export async function markAllNotificationsRead() {
  const response = await apiFetch("/api/notifications/read-all", { method: "PATCH" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de mettre les notifications à jour.");
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(apiUrl("/api/categories"));
  if (!response.ok) throw new Error("Impossible de charger les catégories.");
  return response.json();
}

export async function fetchBookById(id) {
  const response = await fetch(apiUrl(`/api/books/${id}`));

  if (!response.ok) {
    throw new Error("Impossible de charger le livre");
  }

  const data = await response.json();
  return normalizeBook(data);
}

function normalizeSeller(seller = {}) {
  return {
    id: seller.id ?? "",
    name: seller.shop_name ?? "Librairie BookSpace",
    city: seller.city ?? "",
    country: seller.country ?? "",
    latitude: seller.latitude == null ? null : Number(seller.latitude),
    longitude: seller.longitude == null ? null : Number(seller.longitude),
    description: seller.description ?? "",
    rating: Number(seller.rating ?? 0),
    books: Array.isArray(seller.books) ? seller.books.map(normalizeBook) : [],
  };
}

export async function fetchSellers() {
  const response = await fetch(apiUrl("/api/sellers"));

  if (!response.ok) {
    throw new Error("Impossible de charger les librairies");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeSeller) : [];
}

export async function fetchSellerById(id) {
  const response = await fetch(apiUrl(`/api/sellers/${id}`));

  if (!response.ok) {
    throw new Error("Impossible de charger cette librairie");
  }

  return normalizeSeller(await response.json());
}

export async function fetchAdminSellers() {
  const response = await apiFetch("/api/admin/sellers");

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les vendeurs.");
  }

  return response.json();
}

export async function updateSellerStatus(id, kybStatus) {
  const response = await apiFetch(`/api/admin/sellers/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ kyb_status: kybStatus }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de modifier le statut du vendeur.");
  }

  return response.json();
}

export async function fetchCommissions() {
  const response = await apiFetch("/api/admin/commissions");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les commissions.");
  }
  return response.json();
}

export async function updateCommission(id, rate) {
  const response = await apiFetch(`/api/admin/commissions/${id}`, { method: "PATCH", body: JSON.stringify({ taux: rate }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible d'enregistrer cette commission.");
  }
  return response.json();
}

export async function fetchAdminReports() {
  const response = await apiFetch("/api/admin/reports");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de charger les signalements.");
  }
  return response.json();
}

export async function updateAdminReport(id, changes) {
  const response = await apiFetch(`/api/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de traiter ce signalement.");
  }
  return response.json();
}

export default normalizeBook;
