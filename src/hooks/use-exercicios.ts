import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { Exercicio, CreateExercicio, UpdateExercicio } from '@/types/exercicio';
import { uploadExercicioVideo } from '@/lib/supabase/storage';
import { compressVideo } from '@/lib/video-utils';
import { getThumbnailUrl } from '@/lib/youtube';
import { isYouTubeUrl, parseYouTubeId, parseVimeoId } from '@/lib/video-utils';

function exercicioFromRow(row: any, categoria: any): Exercicio {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    videoUrl: row.video_url ?? undefined,
    externalVideoUrl: row.external_video_url ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    youtubeId: row.youtube_id ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    categoriaId: row.categoria_id,
    categoria: {
      id: categoria.id,
      nome: categoria.nome,
      descricao: categoria.descricao,
      createdAt: categoria.created_at,
      updatedAt: categoria.updated_at,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useExercicios() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['exercicios'],
    queryFn: async () => {
      const { data: exercicios, error } = await supabase
        .from('exercicios')
        .select('*, categorias(*)')
        .order('nome', { ascending: true });

      if (error) throw error;

      return exercicios.map((ex: any) => exercicioFromRow(ex, ex.categorias));
    },
  });
}

export function useExercicio(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['exercicios', id],
    queryFn: async () => {
      const { data: exercicio, error } = await supabase
        .from('exercicios')
        .select('*, categorias(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return exercicioFromRow(exercicio, exercicio.categorias);
    },
    enabled: !!id,
  });
}

export function useCreateExercicio() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (data: CreateExercicio) => {
      const payload: Record<string, unknown> = {
        nome: data.nome,
        descricao: data.descricao ?? null,
        video_url: null,
        external_video_url: null,
        youtube_url: null,
        youtube_id: null,
        thumbnail: null,
        categoria_id: data.categoriaId,
      };

      if (data.videoSource === 'url' && data.videoUrl?.trim()) {
        const url = data.videoUrl.trim();
        if (isYouTubeUrl(url)) {
          const youtubeId = parseYouTubeId(url);
          if (youtubeId) {
            payload.youtube_url = url;
            payload.youtube_id = youtubeId;
            payload.thumbnail = getThumbnailUrl(youtubeId);
          }
        } else {
          const vimeoId = parseVimeoId(url);
          if (vimeoId) payload.external_video_url = url;
        }
      }

      const { data: inserted, error: insertError } = await supabase
        .from('exercicios')
        .insert(payload)
        .select('*, categorias(*)')
        .single();

      if (insertError) throw insertError;

      if (data.videoSource === 'file' && data.videoFile) {
        const compressed = await compressVideo(data.videoFile);
        const videoUrl = await uploadExercicioVideo(compressed, inserted.id);
        const { data: exercicio, error: updateError } = await supabase
          .from('exercicios')
          .update({ video_url: videoUrl })
          .eq('id', inserted.id)
          .select('*, categorias(*)')
          .single();
        if (updateError) throw updateError;
        return exercicioFromRow(exercicio, exercicio.categorias);
      }

      return exercicioFromRow(inserted, inserted.categorias);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
    },
  });
}

export function useUpdateExercicio() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExercicio }) => {
      const updateData: Record<string, unknown> = {
        nome: data.nome,
        descricao: data.descricao,
        categoria_id: data.categoriaId,
      };

      if (data.videoSource === 'file' && data.videoFile != null && data.videoFile.size > 0) {
        const compressed = await compressVideo(data.videoFile);
        const videoUrl = await uploadExercicioVideo(compressed, id);
        updateData.video_url = videoUrl;
        updateData.external_video_url = null;
        updateData.youtube_url = null;
        updateData.youtube_id = null;
        updateData.thumbnail = null;
      } else if (data.videoSource === 'url' && data.videoUrl != null && data.videoUrl.trim()) {
        const url = data.videoUrl.trim();
        updateData.video_url = null;
        if (isYouTubeUrl(url)) {
          const youtubeId = parseYouTubeId(url);
          if (youtubeId) {
            updateData.youtube_url = url;
            updateData.youtube_id = youtubeId;
            updateData.thumbnail = getThumbnailUrl(youtubeId);
            updateData.external_video_url = null;
          }
        } else {
          const vimeoId = parseVimeoId(url);
          if (vimeoId) {
            updateData.external_video_url = url;
            updateData.youtube_url = null;
            updateData.youtube_id = null;
            updateData.thumbnail = null;
          }
        }
      }

      const { data: exercicio, error } = await supabase
        .from('exercicios')
        .update(updateData)
        .eq('id', id)
        .select('*, categorias(*)')
        .single();

      if (error) throw error;
      return exercicioFromRow(exercicio, exercicio.categorias);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
      queryClient.invalidateQueries({ queryKey: ['exercicios', variables.id] });
    },
  });
}

export function useDeleteExercicio() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('exercicios').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
    },
  });
}
