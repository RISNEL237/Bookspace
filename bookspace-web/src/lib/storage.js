import { supabase } from './supabaseClient';

export async function uploadPrivateFile(bucket, file, { maxBytes, allowedTypes, allowedExtensions = [], publicUrl = false }) {
  if (!file) throw new Error('Sélectionne un fichier avant de continuer.');
  if (file.size > maxBytes) throw new Error(`Le fichier dépasse la taille maximale de ${Math.floor(maxBytes / 1024 / 1024)} Mo.`);
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) throw new Error('Le format de ce fichier n’est pas accepté.');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Connecte-toi avant de téléverser un fichier.');

  const safeName = file.name.normalize('NFKD').replace(/[^\w.-]+/g, '_').replace(/^\.+/, '') || 'fichier';
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const contentType = file.type || (extension === 'pdf' ? 'application/pdf' : extension === 'epub' ? 'application/epub+zip' : extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : extension === 'png' ? 'image/png' : 'application/octet-stream');
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '60', contentType, upsert: false });
  if (error) throw new Error(`Échec du téléversement : ${error.message}`);
  if (publicUrl) return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  return path;
}
