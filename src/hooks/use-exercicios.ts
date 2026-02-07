import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { Exercicio, CreateExercicio, UpdateExercicio } from '@/types/exercicio';
import { extractVideoId, getThumbnailUrl } from '@/lib/youtube';

function exercicioFromRow(row: any, categoria: any): Exercicio {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
    thumbnail: row.thumbnail,
    categoriaId: row.categoria_id,
    categoria: {
      id: categoria.id,
      nome: categoria.nome,
      slug: categoria.slug,
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
      const youtubeId = extractVideoId(data.youtubeUrl);
      if (!youtubeId) {
        throw new Error('URL do YouTube inválida');
      }

      const thumbnail = getThumbnailUrl(youtubeId);

      const { data: exercicio, error } = await supabase
        .from('exercicios')
        .insert({
          nome: data.nome,
          descricao: data.descricao,
          youtube_url: data.youtubeUrl,
          youtube_id: youtubeId,
          thumbnail,
          categoria_id: data.categoriaId,
        })
        .select('*, categorias(*)')
        .single();

      if (error) throw error;

      return exercicioFromRow(exercicio, exercicio.categorias);
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
      const updateData: any = {
        nome: data.nome,
        descricao: data.descricao,
        categoria_id: data.categoriaId,
      };

      if (data.youtubeUrl) {
        const youtubeId = extractVideoId(data.youtubeUrl);
        if (!youtubeId) {
          throw new Error('URL do YouTube inválida');
        }
        updateData.youtube_url = data.youtubeUrl;
        updateData.youtube_id = youtubeId;
        updateData.thumbnail = getThumbnailUrl(youtubeId);
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
