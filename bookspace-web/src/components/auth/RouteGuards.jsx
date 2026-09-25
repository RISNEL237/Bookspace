import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { fetchMyProfile, fetchSellerProfile } from "../../lib/api";

function useSession() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);
  return session;
}

function Loading() {
  return <div className="p-8 text-center text-muted">Vérification de la session…</div>;
}

export function RequireClient() {
  const session = useSession();
  const location = useLocation();
  if (session === undefined) return <Loading />;
  if (!session) return <Navigate to="/login" replace state={{ retour: `${location.pathname}${location.search}` }} />;
  return <Outlet />;
}

export function RequireAdmin() {
  const session = useSession();
  const [access, setAccess] = useState("checking");
  const location = useLocation();
  useEffect(() => {
    let active = true;
    if (!session) { setAccess(session === undefined ? "checking" : "anonymous"); return () => { active = false; }; }
    setAccess("checking");
    fetchMyProfile().then((profile) => {
      if (active) setAccess(profile?.est_admin ? "allowed" : "denied");
    }).catch(() => { if (active) setAccess("denied"); });
    return () => { active = false; };
  }, [session]);
  if (session === undefined || access === "checking") return <Loading />;
  if (!session) return <Navigate to="/login" replace state={{ retour: `${location.pathname}${location.search}` }} />;
  if (access !== "allowed") return <Navigate to="/" replace />;
  return <Outlet />;
}

export function RequireApprovedSeller() {
  const session = useSession();
  const [seller, setSeller] = useState(undefined);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => {
    let active = true;
    if (!session) { setSeller(undefined); return () => { active = false; }; }
    fetchSellerProfile().then((profile) => {
      if (active) setSeller(profile);
    }).catch((requestError) => {
      if (active) {
        setError(requestError.message);
        setSeller(null);
      }
    });
    return () => { active = false; };
  }, [session]);
  if (session === undefined || (session && seller === undefined)) return <Loading />;
  if (!session) return <Navigate to="/login" replace state={{ retour: `${location.pathname}${location.search}` }} />;
  if (!seller && error.includes("Aucun vendeur associé")) return <Navigate to="/vendeur/inscription" replace />;
  if (!seller) return <div role="alert" className="p-8 text-center text-danger">{error || "Impossible de vérifier votre boutique."}</div>;
  if (seller.kyb_status !== "approved") {
    return <div className="min-h-screen grid place-items-center bg-bg p-6"><div className="card max-w-lg text-center">
      <h1 className="section-title">{seller.kyb_status === "pending" ? "Demande en cours de vérification" : "Accès vendeur suspendu"}</h1>
      <p className="text-muted mt-3">{seller.kyb_status === "pending" ? "Un administrateur doit approuver votre profil avant l’accès au portail vendeur." : "Votre profil vendeur n’est pas actif. Contactez l’administration ou soumettez une nouvelle demande."}</p>
      {seller.kyb_status === "rejected" && <a href="/vendeur/inscription" className="btn-primary inline-block mt-5">Soumettre une nouvelle demande</a>}
    </div></div>;
  }
  return <Outlet />;
}
