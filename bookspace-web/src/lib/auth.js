import { supabase } from './supabaseClient';

export function emailConfirmationRedirectUrl() {
  return `${window.location.origin}/auth/confirmed`;
}

export async function resendSignupConfirmation(email) {
  return supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: { emailRedirectTo: emailConfirmationRedirectUrl() },
  });
}

export function confirmationErrorMessage(error) {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();

  if (code === 'otp_expired' || code === 'email_not_confirmed' || message.includes('email link is invalid') || message.includes('token has expired') || message.includes('otp_expired')) {
    return 'Ce lien a déjà été utilisé, a expiré ou est invalide. Demande un nouveau lien de confirmation.';
  }
  if (code.includes('rate_limit') || code.includes('too_many') || message.includes('rate limit') || message.includes('too many requests')) {
    return 'Trop de demandes ont été envoyées. Attends quelques minutes avant de demander un autre lien.';
  }
  if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError || message.includes('network') || message.includes('fetch')) {
    return 'La connexion a échoué pendant la confirmation. Vérifie ton réseau, puis réessaie ou demande un nouveau lien.';
  }
  if (code === 'flow_state_not_found' || code === 'bad_code_verifier' || message.includes('code verifier')) {
    return 'Le lien a été ouvert dans un navigateur différent de celui utilisé lors de l’inscription. Essaie de te connecter; sinon, demande un nouveau lien.';
  }
  return 'La confirmation n’a pas abouti. Vérifie le lien ou demande-en un nouveau.';
}
