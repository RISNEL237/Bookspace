const CART_KEY = "bookspace_cart";

export function getCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item = {}) {
  const cart = getCartItems();
  const normalized = {
    id: item.id ?? "unknown",
    offerId: item.offerId ?? "",
    title: item.title ?? "Livre",
    author: item.author ?? "Auteur inconnu",
    seller: item.seller ?? "Librairie BookSpace",
    sellerId: item.sellerId ?? "",
    format: item.format ?? "Livre broché",
    qty: Number(item.qty ?? 1),
    price: Number(item.price ?? 0),
    shipping: Number(item.shipping ?? 0),
    cover: item.cover ?? "cv1",
  };

  const existingIndex = cart.findIndex(
    (entry) => entry.offerId === normalized.offerId && entry.format === normalized.format
  );

  if (existingIndex >= 0) {
    cart[existingIndex].qty += normalized.qty;
  } else {
    cart.push(normalized);
  }

  saveCartItems(cart);
  return cart;
}

export function updateCartItemQuantity(id, format, delta, offerId) {
  const cart = getCartItems();
  const next = cart
    .map((item) => {
      if (item.id !== id || item.format !== format || (offerId && item.offerId !== offerId)) {
        return item;
      }

      return { ...item, qty: Math.max(1, Number(item.qty ?? 1) + Number(delta ?? 0)) };
    })
    .filter((item) => item.qty > 0);

  saveCartItems(next);
  return next;
}

export function removeCartItem(id, format, offerId) {
  const next = getCartItems().filter(
    (item) => !(item.id === id && item.format === format && (!offerId || item.offerId === offerId))
  );

  saveCartItems(next);
  return next;
}

export function clearCart() {
  saveCartItems([]);
  return [];
}
