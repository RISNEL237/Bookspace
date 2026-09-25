import { supabase } from "./supabaseClient";

const normalizeBook = (book = {}) => ({
  id: book.id ?? "",
  title: book.title ?? "Titre indisponible",
  author: book.author ?? "Auteur inconnu",
  genre: book.genre ?? "Divers",
  rating: Number(book.rating ?? 4.5),
  reviews: Number(book.reviews_count ?? 0),
  pricePaper: Number(book.price_paper ?? 0),
  priceEbook: Number(book.price_ebook ?? 0),
  seller: book.seller?.shop_name ?? "Librairie BookSpace",
  sellerId: book.seller_id ?? book.seller?.id ?? "",
  sellerCity: book.seller?.city ?? "France",
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

  const response = await fetch(path, { ...options, headers });

  if (response.status === 401) {
    throw new Error("Vous devez être connecté pour continuer.");
  }

  return response;
}

export async function createOrder(items, paymentProvider = "stripe", paymentPhone = null) {
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

export async function fetchOrderById(id) {
  const response = await apiFetch(`/api/orders/${id}`);

  if (!response.ok) {
    throw new Error("Impossible de charger cette commande.");
  }

  return response.json();
}

export async function fetchBooks() {
  const response = await fetch("/api/books");

  if (!response.ok) {
    throw new Error("Impossible de charger le catalogue");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeBook) : [];
}

export async function fetchBookById(id) {
  const response = await fetch(`/api/books/${id}`);

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
    description: seller.description ?? "",
    rating: Number(seller.rating ?? 0),
    books: Array.isArray(seller.books) ? seller.books.map(normalizeBook) : [],
  };
}

export async function fetchSellers() {
  const response = await fetch("/api/sellers");

  if (!response.ok) {
    throw new Error("Impossible de charger les librairies");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeSeller) : [];
}

export async function fetchSellerById(id) {
  const response = await fetch(`/api/sellers/${id}`);

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

export default normalizeBook;
