'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { useTreinos } from '@/hooks/use-treinos';
import { useCategorias } from '@/hooks/use-categorias';
import { MultiCategoriaFilter } from '@/components/shared/MultiCategoriaFilter';
import type { Treino } from '@/types/treino';
import type { Categoria } from '@/types/categoria';

export default function TreinosPage() {
  const { data: treinos, isLoading } = useTreinos();
  const { data: categorias } = useCategorias();
  const [selectedCategoriaIds, setSelectedCategoriaIds] = useState<string[]>([]);

  const getCategoriasDoTreino = (treino: Treino): Categoria[] => {
    const categoriaIds = new Set(
      treino.exercicios.map((ex) => ex.exercicio.categoriaId)
    );
    return categorias?.filter((cat) => categoriaIds.has(cat.id)) || [];
  };

  const filteredTreinos = useMemo(() => {
    if (!treinos) return [];
    if (selectedCategoriaIds.length === 0) return treinos;

    return treinos.filter((treino) => {
      const categoriasNoTreino = new Set(
        treino.exercicios.map((ex) => ex.exercicio.categoriaId)
      );
      return selectedCategoriaIds.some((categoriaId) =>
        categoriasNoTreino.has(categoriaId)
      );
    });
  }, [treinos, selectedCategoriaIds]);

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Treinos</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <MultiCategoriaFilter
            selectedCategoriaIds={selectedCategoriaIds}
            onCategoriaChange={setSelectedCategoriaIds}
          />
          <Link
            href="/dashboard/treinos/novo"
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Novo Treino
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {filteredTreinos && filteredTreinos.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Exercícios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Categorias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTreinos.map((treino) => (
                    <tr key={treino.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{treino.nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {treino.exercicios.length} exercício(s)
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {getCategoriasDoTreino(treino).map((categoria) => (
                            <span
                              key={categoria.id}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                            >
                              {categoria.nome}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/treinos/${treino.id}`}
                          className="text-primary hover:opacity-80 mr-4"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/dashboard/treinos/${treino.id}/editar`}
                          className="text-primary hover:opacity-80 mr-4"
                        >
                          Editar
                        </Link>
                        <a
                          href={`/nfc/${treino.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:opacity-80 inline-flex items-center gap-1"
                          title="Abrir página pública NFC"
                        >
                          <ExternalLink className="w-4 h-4" />
                          NFC
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTreinos.map((treino) => (
                <div key={treino.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{treino.nome}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {treino.exercicios.length} exercício(s)
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {getCategoriasDoTreino(treino).map((categoria) => (
                      <span
                        key={categoria.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                      >
                        {categoria.nome}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/treinos/${treino.id}`}
                      className="text-primary hover:opacity-80 text-sm"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/dashboard/treinos/${treino.id}/editar`}
                      className="text-primary hover:opacity-80 text-sm"
                    >
                      Editar
                    </Link>
                    <a
                      href={`/nfc/${treino.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:opacity-80 text-sm inline-flex items-center gap-1"
                      title="Abrir página pública NFC"
                    >
                      <ExternalLink className="w-3 h-3" />
                      NFC
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {selectedCategoriaIds.length > 0
              ? 'Nenhum treino encontrado para as categorias selecionadas.'
              : 'Nenhum treino cadastrado ainda.'}
          </div>
        )}
      </div>
    </div>
  );
}
