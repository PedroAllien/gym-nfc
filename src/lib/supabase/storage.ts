import { createClient } from './client';

export async function uploadAcademiaLogo(file: File, academiaId: string): Promise<string> {
  const supabase = createClient();
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
  const supabase = createClient();
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

const EXERCICIO_VIDEOS_BUCKET = 'exercicio-videos';

export async function uploadExercicioVideo(file: File, exercicioId: string): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'mp4';
  const fileName = `${exercicioId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from(EXERCICIO_VIDEOS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(EXERCICIO_VIDEOS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteExercicioVideo(publicUrl: string): Promise<void> {
  const supabase = createClient();
  try {
    const path = publicUrl.split(`/object/public/${EXERCICIO_VIDEOS_BUCKET}/`)[1];
    if (path) await supabase.storage.from(EXERCICIO_VIDEOS_BUCKET).remove([path]);
  } catch (e) {
    console.error('Erro ao remover vídeo:', e);
  }
}
