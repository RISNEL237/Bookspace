import React, { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../../lib/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const result = await fetchNotifications();
      setNotifications(result.data ?? []);
      setError("");
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    try {
      await markNotificationRead(id);
      setNotifications((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
    } catch (exception) {
      setError(exception.message);
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
    } catch (exception) {
      setError(exception.message);
    }
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return <section>
    <div className="flex items-start justify-between gap-4 mb-6">
      <div><h1 className="section-title">Notifications</h1><p className="text-muted text-sm mt-1">Suivi des événements de votre compte et de vos commandes.</p></div>
      {unreadCount > 0 && <button type="button" onClick={markAllRead} className="btn-secondary flex items-center gap-2"><CheckCheck size={16} />Tout marquer comme lu</button>}
    </div>
    {error && <div role="alert" className="text-danger text-sm mb-4">{error}</div>}
    {loading ? <div className="card text-muted">Chargement…</div> : notifications.length === 0 ? <div className="card text-center text-muted"><Bell className="mx-auto mb-3" /><p>Vous n’avez pas encore de notification.</p></div> : <div className="space-y-3">
      {notifications.map((item) => <article key={item.id} className={`card flex items-start gap-3 ${item.is_read ? "opacity-75" : "border-accent"}`}>
        <span className="mt-1 text-accent"><Bell size={18} /></span>
        <div className="flex-1"><p className="text-sm">{item.message}</p><time className="text-faint text-xs mt-2 block">{new Date(item.created_at).toLocaleString("fr-CM")}</time></div>
        {!item.is_read && <button type="button" onClick={() => markRead(item.id)} className="text-accent text-xs font-bold">Marquer comme lue</button>}
      </article>)}
    </div>}
  </section>;
}
