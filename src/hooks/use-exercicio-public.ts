import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Exercicio } from '@/types/exercicio';
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

function exercicioFromRow(row: any, categoria: any): Exercicio {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
    thumbnail: row.thumbnail,
    categoriaId: row.categoria_id,
    categoria: categoriaFromRow(categoria),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useExercicioPublic(id: string) {
  return useQuery({
    queryKey: ['exercicio-public', id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('exercicios')
        .select('*, categorias(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return exercicioFromRow(data, data.categorias);
    },
    enabled: !!id,
  });
}
