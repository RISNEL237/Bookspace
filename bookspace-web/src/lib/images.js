// ============================================================
// Images de substitution (placeholders)
// ============================================================
// En attendant les vraies photos de couvertures/libraires/auteurs,
// on utilise un service de génération d'images à partir d'une
// "graine" (seed) : la même graine donne toujours la même image,
// ce qui évite que les photos changent à chaque rafraîchissement.
//
// À REMPLACER plus tard par de vraies URLs (Supabase Storage) une
// fois le catalogue de photos disponible — il suffira de modifier
// UNIQUEMENT ce fichier, aucune page n'a besoin d'être retouchée.

export function urlCouverture(graine, largeur = 400, hauteur = 560) {
  return `https://picsum.photos/seed/${encodeURIComponent(graine)}/${largeur}/${hauteur}`;
}

export function urlPortrait(graine, taille = 200) {
  return `https://picsum.photos/seed/${encodeURIComponent(graine)}/${taille}/${taille}`;
}

export function urlPaysage(graine, largeur = 800, hauteur = 400) {
  return `https://picsum.photos/seed/${encodeURIComponent(graine)}/${largeur}/${hauteur}`;
}
