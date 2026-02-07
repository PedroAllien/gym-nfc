import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Treino, TreinoExercicio } from '@/types/treino';
import type { Categoria } from '@/types/categoria';

const supabase = createClient();

function categoriaFromRow(row: any): Categoria {
  return {
    id: row.id,
    nome: row.nome,
    slug: row.slug,
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

export function useTreinoPublic(id: string) {
  return useQuery({
    queryKey: ['treino-public', id],
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
