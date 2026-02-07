'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCategorias } from '@/hooks/use-categorias';

export default function CategoriasPage() {
  const { data: categorias, isLoading } = useCategorias();

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Categorias</h1>
        <Link
          href="/dashboard/categorias/nova"
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {categorias && categorias.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{categoria.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{categoria.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/categorias/${categoria.id}/editar`}
                          className="text-primary hover:opacity-80"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{categoria.nome}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{categoria.slug}</div>
                  <Link
                    href={`/dashboard/categorias/${categoria.id}/editar`}
                    className="text-primary hover:opacity-80 text-sm"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Nenhuma categoria cadastrada ainda.</div>
        )}
      </div>
    </div>
  );
}
