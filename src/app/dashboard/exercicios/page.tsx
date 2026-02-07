'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { useExercicios } from '@/hooks/use-exercicios';
import { CategoriaFilter } from '@/components/shared/CategoriaFilter';

export default function ExerciciosPage() {
  const { data: exercicios, isLoading } = useExercicios();
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);

  const filteredExercicios = useMemo(() => {
    if (!exercicios) return [];
    if (!selectedCategoriaId) return exercicios;
    return exercicios.filter((exercicio) => exercicio.categoriaId === selectedCategoriaId);
  }, [exercicios, selectedCategoriaId]);

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Exercícios</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <CategoriaFilter
            selectedCategoriaId={selectedCategoriaId}
            onCategoriaChange={setSelectedCategoriaId}
          />
          <Link
            href="/dashboard/exercicios/novo"
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Novo Exercício
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {filteredExercicios && filteredExercicios.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExercicios.map((exercicio) => (
                    <tr key={exercicio.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{exercicio.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{exercicio.categoria.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/exercicios/${exercicio.id}`}
                          className="text-primary hover:opacity-80 mr-4"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/dashboard/exercicios/${exercicio.id}/editar`}
                          className="text-primary hover:opacity-80 mr-4"
                        >
                          Editar
                        </Link>
                        <a
                          href={`/nfc/exercicios/${exercicio.id}`}
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
              {filteredExercicios.map((exercicio) => (
                <div key={exercicio.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{exercicio.nome}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{exercicio.categoria.nome}</div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/exercicios/${exercicio.id}`}
                      className="text-primary hover:opacity-80 text-sm"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/dashboard/exercicios/${exercicio.id}/editar`}
                      className="text-primary hover:opacity-80 text-sm"
                    >
                      Editar
                    </Link>
                    <a
                      href={`/nfc/exercicios/${exercicio.id}`}
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
            {selectedCategoriaId
              ? 'Nenhum exercício encontrado para esta categoria.'
              : 'Nenhum exercício cadastrado ainda.'}
          </div>
        )}
      </div>
    </div>
  );
}
