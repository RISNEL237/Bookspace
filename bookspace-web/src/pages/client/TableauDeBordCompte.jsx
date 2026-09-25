import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAddresses, fetchDigitalLibrary, fetchMyProfile, fetchOrders } from "../../lib/api";
import CouvertureLivre from "../../components/ui/CouvertureLivre";
import { CarteIndicateur } from "../../components/ui/Composants";
import { BookOpen, Package, BookMarked, MapPin, ShieldCheck } from "lucide-react";

export default function TableauDeBordCompte() {
  const [commandes, setCommandes] = useState([]);
  const [bibliotheque, setBibliotheque] = useState([]);
  const [profil, setProfil] = useState(null);
  const [adresse, setAdresse] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    Promise.all([fetchOrders(), fetchDigitalLibrary(), fetchMyProfile(), fetchAddresses()])
      .then(([orders, library, user, addresses]) => {
        setCommandes(orders); setBibliotheque(library); setProfil(user);
        setAdresse(addresses.find((item) => item.is_default) || addresses[0] || null);
      })
      .catch((error) => setErreur(error.message));
  }, []);

  const enCours = commandes.filter((commande) => !["delivered", "cancelled", "refunded"].includes(commande.status));
  return <div>
    <div className="flex justify-between items-start mb-6"><div><div className="section-title">Bonjour{profil?.nom_complet ? `, ${profil.nom_complet}` : ""}</div><div className="text-muted text-sm mt-1">Vos commandes et vos livres numériques.</div></div><Link to="/compte/bibliotheque" className="btn-accent"><BookOpen size={16} className="inline mr-1.5" />Ma bibliothèque</Link></div>
    {erreur && <div role="alert" className="text-danger text-sm mb-4">{erreur}</div>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><CarteIndicateur label="Commandes en cours" value={String(enCours.length)} /><CarteIndicateur label="Livres numériques" value={String(bibliotheque.length)} /></div>
    <div className="flex flex-col md:flex-row gap-6 mt-6 items-start"><div className="flex-[1.5] w-full space-y-5">
      <div className="card"><div className="flex justify-between items-center mb-3.5"><div className="card-title mb-0 flex items-center gap-2"><Package size={16} /> Mes commandes</div><Link to="/compte/commandes" className="text-sm font-bold text-accent-dark">Voir l'historique</Link></div>
        {commandes.slice(0, 3).map((order) => { const item = order.items?.[0]; return <Link key={order.id} to={`/compte/commandes/${order.id}`} className="flex items-center gap-3 py-3 border-b border-border last:border-0"><CouvertureLivre cover={item?.book?.cover_style} graine={item?.book_id || order.id} className="w-9 h-12" /><span className="flex-1"><b className="block text-sm">{item?.book?.title || `${order.items?.length || 0} article(s)`}</b><small className="text-faint">#{order.id}</small></span><span className="pill-info">{order.status}</span></Link>; })}
        {!erreur && commandes.length === 0 && <div className="text-muted text-sm">Aucune commande.</div>}
      </div>
      <div className="card"><div className="flex justify-between items-center mb-3"><div className="card-title mb-0 flex items-center gap-2"><BookMarked size={16} /> Ma bibliothèque numérique</div><Link to="/compte/bibliotheque" className="text-sm font-bold text-accent-dark">Voir tout</Link></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{bibliotheque.slice(0, 4).map((book) => <div key={book.id} className="border border-border rounded p-3 flex gap-3"><CouvertureLivre cover={book.cover} graine={book.id} className="w-12 h-16 shrink-0" /><div><b className="text-sm">{book.title}</b><div className="text-faint text-xs">{book.author}</div></div></div>)}</div>
        {!erreur && bibliotheque.length === 0 && <div className="text-muted text-sm">Aucun livre numérique acheté.</div>}
      </div>
    </div><div className="w-full md:w-[320px] shrink-0 space-y-5"><div className="card"><div className="card-title flex items-center gap-2"><ShieldCheck size={16} />Sécurité du compte</div><div className="text-muted text-sm mb-4">{profil?.email || ""}</div><Link to="/compte/parametres" className="btn-outline btn-sm w-full">Gérer mon compte</Link></div>
      <div className="card"><div className="card-title flex items-center gap-2"><MapPin size={16} />Adresse de livraison</div>{adresse ? <div className="text-muted text-sm leading-relaxed">{adresse.nom_destinataire}<br />{adresse.adresse?.street}<br />{[adresse.adresse?.city, adresse.adresse?.country].filter(Boolean).join(", ")}</div> : <div className="text-muted text-sm">Aucune adresse enregistrée.</div>}<Link to="/compte/adresses" className="btn-outline btn-sm mt-3">Gérer mes adresses</Link></div>
    </div></div>
  </div>;
}
