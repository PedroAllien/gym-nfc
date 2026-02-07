'use client';

import { useCategorias } from '@/hooks/use-categorias';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoriaFilterProps {
  selectedCategoriaId: string | null;
  onCategoriaChange: (categoriaId: string | null) => void;
  className?: string;
}

export function CategoriaFilter({
  selectedCategoriaId,
  onCategoriaChange,
  className,
}: CategoriaFilterProps) {
  const { data: categorias, isLoading } = useCategorias();

  if (isLoading) {
    return (
      <div className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>
        Carregando categorias...
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <select
        value={selectedCategoriaId || ''}
        onChange={(e) => onCategoriaChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="">Todas as categorias</option>
        {categorias?.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
