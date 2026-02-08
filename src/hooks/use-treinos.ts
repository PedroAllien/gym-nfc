import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { Treino, CreateTreino, UpdateTreino, TreinoExercicio } from '@/types/treino';
import type { Categoria } from '@/types/categoria';

function categoriaFromRow(row: any): Categoria {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function treinoExercicioFromRow(row: any, exercicio: any): TreinoExercicio {
  return {
    id: row.id,
    treinoId: row.treino_id,
    exercicioId: row.exercicio_id,
    ordem: row.ordem,
    series: row.series,
    repeticoes: row.repeticoes,
    descanso: row.descanso,
    observacao: row.observacao,
    exercicio: {
      id: exercicio.id,
      nome: exercicio.nome,
      descricao: exercicio.descricao,
      youtubeUrl: exercicio.youtube_url,
      youtubeId: exercicio.youtube_id,
      thumbnail: exercicio.thumbnail,
      categoriaId: exercicio.categoria_id,
      categoria: categoriaFromRow(exercicio.categorias),
      createdAt: exercicio.created_at,
      updatedAt: exercicio.updated_at,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function treinoFromRow(row: any): Treino {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    exercicios: row.treino_exercicios
      ? row.treino_exercicios.map((te: any) =>
          treinoExercicioFromRow(te, te.exercicios)
        )
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useTreinos() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['treinos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treinos')
        .select(
          `
          *,
          treino_exercicios (
            *,
            exercicios (
              *,
              categorias (*)
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(treinoFromRow);
    },
  });
}

export function useTreino(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['treinos', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treinos')
        .select(
          `
          *,
          treino_exercicios (
            *,
            exercicios (
              *,
              categorias (*)
            )
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      return treinoFromRow(data);
    },
    enabled: !!id,
  });
}

export function useCreateTreino() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (data: CreateTreino) => {
      const { data: treino, error: treinoError } = await supabase
        .from('treinos')
        .insert({
          nome: data.nome,
          descricao: data.descricao,
        })
        .select()
        .single();

      if (treinoError) throw treinoError;

      if (data.exercicios.length > 0) {
        const { error: exerciciosError } = await supabase
          .from('treino_exercicios')
          .insert(
            data.exercicios.map((ex) => ({
              treino_id: treino.id,
              exercicio_id: ex.exercicioId,
              ordem: ex.ordem,
              series: ex.series,
              repeticoes: ex.repeticoes,
              descanso: ex.descanso,
              observacao: ex.observacao,
            }))
          );

        if (exerciciosError) throw exerciciosError;
      }

      const { data: treinoCompleto, error } = await supabase
        .from('treinos')
        .select(
          `
          *,
          treino_exercicios (
            *,
            exercicios (
              *,
              categorias (*)
            )
          )
        `
        )
        .eq('id', treino.id)
        .single();

      if (error) throw error;

      return treinoFromRow(treinoCompleto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
    },
  });
}

export function useUpdateTreino() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTreino }) => {
      if (data.nome || data.descricao) {
        const updateData: any = {};
        if (data.nome) updateData.nome = data.nome;
        if (data.descricao !== undefined) updateData.descricao = data.descricao;

        const { error } = await supabase.from('treinos').update(updateData).eq('id', id);
        if (error) throw error;
      }

      if (data.exercicios) {
        await supabase.from('treino_exercicios').delete().eq('treino_id', id);

        if (data.exercicios.length > 0) {
          const { error } = await supabase
            .from('treino_exercicios')
            .insert(
              data.exercicios.map((ex) => ({
                treino_id: id,
                exercicio_id: ex.exercicioId,
                ordem: ex.ordem,
                series: ex.series,
                repeticoes: ex.repeticoes,
                descanso: ex.descanso,
                observacao: ex.observacao,
              }))
            );

          if (error) throw error;
        }
      }

      const { data: treinoCompleto, error } = await supabase
        .from('treinos')
        .select(
          `
          *,
          treino_exercicios (
            *,
            exercicios (
              *,
              categorias (*)
            )
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      return treinoFromRow(treinoCompleto);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
      queryClient.invalidateQueries({ queryKey: ['treinos', variables.id] });
    },
  });
}

export function useDeleteTreino() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('treinos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
    },
  });
}
