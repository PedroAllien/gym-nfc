import { createClient } from './client';

const supabase = createClient();

export async function uploadAcademiaLogo(file: File, academiaId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${academiaId}-${Date.now()}.${fileExt}`;
  const filePath = `academias/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('academias')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('academias').getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteAcademiaLogo(filePath: string): Promise<void> {
  const fileName = filePath.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage.from('academias').remove([`academias/${fileName}`]);
  if (error) {
    console.error('Erro ao deletar logo:', error);
  }
}

export function getAcademiaLogoUrl(filePath: string | null): string | null {
  if (!filePath) return null;
  return filePath;
}
