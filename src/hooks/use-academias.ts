import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import { createClient } from '@/lib/supabase/client';
import type { Academia, CreateAcademia, UpdateAcademia } from '@/types/academia';

function academiaFromRow(row: any): Academia {
  return {
    id: row.id,
    nome: row.nome,
    endereco: row.endereco,
    latitude: row.latitude,
    longitude: row.longitude,
    raio: row.raio,
    logoUrl: row.logo_url || null,
    ativo: row.ativo !== undefined ? row.ativo : true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useAcademias(filtroStatus?: 'ativo' | 'inativo' | 'todos') {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['academias', filtroStatus],
    queryFn: async () => {
      let query = supabase
        .from('academias')
        .select('*');

      if (filtroStatus === 'ativo') {
        query = query.eq('ativo', true);
      } else if (filtroStatus === 'inativo') {
        query = query.eq('ativo', false);
      }

      const { data, error } = await query.order('nome', { ascending: true });

      if (error) throw error;

      return data.map(academiaFromRow);
    },
  });
}

export function useAcademia(id: string, options?: { enabled?: boolean; includeInactive?: boolean }) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['academias', id],
    queryFn: async () => {
      let query = supabase
        .from('academias')
        .select('*')
        .eq('id', id);

      if (!options?.includeInactive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      return academiaFromRow(data);
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
}

export function useCreateAcademia() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (data: CreateAcademia) => {
      const { data: academia, error } = await supabase
        .from('academias')
        .insert({
          nome: data.nome,
          endereco: data.endereco,
          latitude: data.latitude,
          longitude: data.longitude,
          raio: data.raio,
          logo_url: data.logoUrl || null,
          ativo: true,
        })
        .select()
        .single();

      if (error) throw error;

      return academiaFromRow(academia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academias'] });
    },
  });
}

export function useUpdateAcademia() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAcademia }) => {
      const { data: academia, error } = await supabase
        .from('academias')
        .update({
          nome: data.nome,
          endereco: data.endereco,
          latitude: data.latitude,
          longitude: data.longitude,
          raio: data.raio,
          logo_url: data.logoUrl !== undefined ? data.logoUrl : undefined,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return academiaFromRow(academia);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['academias'] });
      queryClient.invalidateQueries({ queryKey: ['academias', variables.id] });
    },
  });
}

export function useDeleteAcademia() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academias')
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academias'] });
      queryClient.invalidateQueries({ queryKey: ['academias-public'] });
    },
  });
}

export function useActivateAcademia() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academias')
        .update({ ativo: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academias'] });
      queryClient.invalidateQueries({ queryKey: ['academias-public'] });
    },
  });
}

export function useAcademiasPublic() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['academias-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academias')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;

      return data.map(academiaFromRow);
    },
  });
}
