import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { Categoria, CreateCategoria, UpdateCategoria } from '@/types/categoria';

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

export function useCategorias() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      return data.map(categoriaFromRow);
    },
  });
}

export function useCategoria(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['categorias', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return categoriaFromRow(data);
    },
    enabled: !!id,
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (data: CreateCategoria) => {
      const { data: categoria, error } = await supabase
        .from('categorias')
        .insert({
          nome: data.nome,
          slug: data.slug,
          descricao: data.descricao,
        })
        .select()
        .single();

      if (error) throw error;

      return categoriaFromRow(categoria);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoria }) => {
      const { data: categoria, error } = await supabase
        .from('categorias')
        .update({
          nome: data.nome,
          slug: data.slug,
          descricao: data.descricao,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return categoriaFromRow(categoria);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias', variables.id] });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categorias').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}
