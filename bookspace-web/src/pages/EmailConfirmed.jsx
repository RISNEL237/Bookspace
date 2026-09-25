import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, CircleAlert, LoaderCircle, Mail } from "lucide-react";
import { confirmationErrorMessage, emailConfirmationRedirectUrl, resendSignupConfirmation } from "../lib/auth";
import { consumeEmailConfirmationCallback, supabase } from "../lib/supabaseClient";

function readCallbackFromUrl() {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const read = (name) => query.get(name) || hash.get(name) || "";
  return {
    authCode: read("code"),
    code: Boolean(read("code")),
    accessToken: Boolean(read("access_token")),
    accessTokenValue: read("access_token"),
    tokenHash: read("token_hash"),
    type: read("type"),
    error: read("error"),
    errorCode: read("error_code"),
    errorDescription: read("error_description"),
    email: read("email"),
  };
}

export default function EmailConfirmed() {
  const [callback] = useState(() => consumeEmailConfirmationCallback() || readCallbackFromUrl());
  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState(callback.email || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const processed = useRef(false);

  async function verifyCallback() {
    setStatus("verifying");
    setMessage("");
    try {
      if (callback.error || callback.errorCode || callback.errorDescription) {
        const error = {
          code: callback.errorCode || callback.error,
          message: callback.errorDescription || callback.error,
        };
        setMessage(confirmationErrorMessage(error));
        setStatus("problem");
        return;
      }

      if (callback.tokenHash) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: callback.tokenHash,
          type: callback.type || "signup",
        });
        if (error) throw error;
        setEmail(data.user?.email || email);
        setStatus("confirmed");
        return;
      }

      if (!callback.code && !callback.accessToken) {
        setMessage("Aucun lien de confirmation n’a été détecté. Tu peux demander un nouvel e-mail ci-dessous.");
        setStatus("missing");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const confirmed = Boolean(data.session?.user?.email_confirmed_at || data.session?.user?.confirmed_at);
      if (confirmed) {
        setEmail(data.session?.user?.email || email);
        setStatus("confirmed");
        return;
      }

      if (callback.authCode) {
        const exchange = await supabase.auth.exchangeCodeForSession(callback.authCode);
        if (exchange.error) throw exchange.error;
        setEmail(exchange.data.user?.email || exchange.data.session?.user?.email || email);
        setStatus("confirmed");
        return;
      }

      if (callback.accessTokenValue) {
        const userResult = await supabase.auth.getUser(callback.accessTokenValue);
        if (userResult.error) throw userResult.error;
        if (userResult.data.user?.email_confirmed_at || userResult.data.user?.confirmed_at) {
          setEmail(userResult.data.user.email || email);
          setStatus("confirmed");
          return;
        }
      }
      setMessage("La confirmation n’a pas pu être vérifiée. Réessaie ou demande un nouveau lien.");
      setStatus("problem");
    } catch (error) {
      setMessage(confirmationErrorMessage(error));
      setStatus("problem");
    }
  }

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    verifyCallback();
  }, []);

  async function resend(event) {
    event.preventDefault();
    setMessage("");
    if (!email.trim()) {
      setMessage("Saisis l’adresse e-mail utilisée lors de ton inscription.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await resendSignupConfirmation(email);
      if (error) throw error;
      setStatus("sent");
      setMessage("Si ce compte existe et que son adresse n’est pas encore confirmée, un nouveau lien vient d’être envoyé.");
    } catch (error) {
      setStatus("problem");
      setMessage(confirmationErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const isVerifying = status === "verifying";
  const isConfirmed = status === "confirmed";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <header className="bg-slate-950 px-6 py-7 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-white text-2xl font-extrabold tracking-tight">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500"><BookOpen size={22} /></span>
              <span>Book<span className="text-amber-500">space</span></span>
            </Link>
          </header>

          <div className="px-6 sm:px-10 py-10 text-center">
            <div className={`mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center ${isConfirmed ? "bg-emerald-50 text-emerald-500" : isVerifying ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-600"}`}>
              {isVerifying ? <LoaderCircle size={42} className="animate-spin" /> : isConfirmed ? <CheckCircle2 size={50} /> : <CircleAlert size={44} />}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isVerifying ? "Vérification du lien…" : isConfirmed ? "Adresse e-mail confirmée" : status === "sent" ? "Vérifie ta boîte e-mail" : "Confirmation non terminée"}
            </h1>
            <p className="mt-4 text-slate-600 leading-7" role={message ? "status" : undefined}>
              {isVerifying
                ? "Nous vérifions le lien de confirmation."
                : isConfirmed
                  ? "Ton adresse e-mail est confirmée. Tu peux maintenant te connecter à BookSpace."
                  : message}
            </p>

            {isConfirmed ? (
              <Link to="/login" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 font-bold text-white hover:bg-amber-600">
                Se connecter à BookSpace <ArrowRight size={19} />
              </Link>
            ) : !isVerifying && (
              <>
                {status === "problem" && <Link to="/login" className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Essayer de se connecter</Link>}
                <form onSubmit={resend} className="mt-6 text-left">
                  <label htmlFor="confirmation-email" className="block text-sm font-semibold text-slate-700 mb-2">Adresse e-mail du compte</label>
                  <input id="confirmation-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500" placeholder="vous@exemple.com" />
                  <button type="submit" disabled={busy} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 font-bold text-white hover:bg-amber-600 disabled:opacity-60">
                    <Mail size={18} />{busy ? "Envoi en cours…" : "Renvoyer le lien de confirmation"}
                  </button>
                  <button type="button" onClick={() => { processed.current = false; verifyCallback(); }} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-800">Réessayer la vérification</button>
                </form>
              </>
            )}
          </div>
          <footer className="border-t border-slate-100 bg-slate-50 px-6 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} Bookspace · Ton espace dédié aux livres.</footer>
        </section>
      </div>
    </main>
  );
}
