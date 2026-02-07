'use client';

import { useCategorias } from '@/hooks/use-categorias';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface MultiCategoriaFilterProps {
  selectedCategoriaIds: string[];
  onCategoriaChange: (categoriaIds: string[]) => void;
  className?: string;
}

export function MultiCategoriaFilter({
  selectedCategoriaIds,
  onCategoriaChange,
  className,
}: MultiCategoriaFilterProps) {
  const { data: categorias, isLoading } = useCategorias();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleCategoria = (categoriaId: string) => {
    if (selectedCategoriaIds.includes(categoriaId)) {
      onCategoriaChange(selectedCategoriaIds.filter((id) => id !== categoriaId));
    } else {
      onCategoriaChange([...selectedCategoriaIds, categoriaId]);
    }
  };

  const clearAll = () => {
    onCategoriaChange([]);
  };

  if (isLoading) {
    return (
      <div className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>
        Carregando categorias...
      </div>
    );
  }

  const selectedCategorias = categorias?.filter((cat) =>
    selectedCategoriaIds.includes(cat.id)
  );

  const filteredCategorias = categorias?.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeCategoria = (categoriaId: string) => {
    onCategoriaChange(selectedCategoriaIds.filter((id) => id !== categoriaId));
  };

  const getButtonText = () => {
    if (selectedCategoriaIds.length === 0) return 'Todas as categorias';
    return `${selectedCategoriaIds.length} selecionada(s)`;
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          {getButtonText()}
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>
        {selectedCategoriaIds.length > 0 && (
          <button
            onClick={clearAll}
            className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>

      {selectedCategoriaIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedCategorias?.map((categoria) => (
            <span
              key={categoria.id}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            >
              {categoria.nome}
              <button
                onClick={() => removeCategoria(categoria.id)}
                className="hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg min-w-[280px] max-w-[320px]">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredCategorias && filteredCategorias.length > 0 ? (
              <div className="space-y-1">
                {filteredCategorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoriaIds.includes(categoria.id)}
                      onChange={() => toggleCategoria(categoria.id)}
                      className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-white flex-1">
                      {categoria.nome}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhuma categoria encontrada
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
