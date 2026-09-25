import { createClient } from '@supabase/supabase-js';

const EMAIL_CONFIRMATION_CALLBACK_KEY = 'bookspace:email-confirmation-callback';
let pendingEmailConfirmationCallback = null;
let emailConfirmationCallbackConsumed = false;
let consumedEmailConfirmationCallback = null;

function captureEmailConfirmationCallback() {
  if (typeof window === 'undefined' || window.location.pathname !== '/auth/confirmed') return;

  try {
    window.sessionStorage.removeItem(EMAIL_CONFIRMATION_CALLBACK_KEY);
  } catch {
    // La capture en mémoire reste disponible si le navigateur bloque le stockage.
  }

  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const read = (name) => query.get(name) || hash.get(name) || '';
  const callback = {
    authCode: read('code'),
    code: Boolean(read('code')),
    accessToken: Boolean(read('access_token')),
    accessTokenValue: read('access_token'),
    tokenHash: read('token_hash'),
    type: read('type'),
    error: read('error'),
    errorCode: read('error_code'),
    errorDescription: read('error_description'),
    email: read('email'),
  };

  if (!callback.code && !callback.accessToken && !callback.tokenHash && !callback.error && !callback.errorCode && !callback.errorDescription) return;
  pendingEmailConfirmationCallback = callback;

  try {
    window.sessionStorage.setItem(EMAIL_CONFIRMATION_CALLBACK_KEY, JSON.stringify(callback));
  } catch {
    // Le callback reste exploitable via l'URL lorsque sessionStorage est indisponible.
  }
}

captureEmailConfirmationCallback();

export function consumeEmailConfirmationCallback() {
  if (emailConfirmationCallbackConsumed) return consumedEmailConfirmationCallback;
  emailConfirmationCallbackConsumed = true;
  try {
    const value = window.sessionStorage.getItem(EMAIL_CONFIRMATION_CALLBACK_KEY);
    window.sessionStorage.removeItem(EMAIL_CONFIRMATION_CALLBACK_KEY);
    consumedEmailConfirmationCallback = value ? JSON.parse(value) : pendingEmailConfirmationCallback;
    pendingEmailConfirmationCallback = null;
    return consumedEmailConfirmationCallback;
  } catch {
    consumedEmailConfirmationCallback = pendingEmailConfirmationCallback;
    pendingEmailConfirmationCallback = null;
    return consumedEmailConfirmationCallback;
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sont requises.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
