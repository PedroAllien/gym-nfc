'use client';

import Link from 'next/link';
import { Plus, MapPin } from 'lucide-react';
import { useAcademias } from '@/hooks/use-academias';
import { useDeleteAcademia } from '@/hooks/use-academias';
import { toast } from 'sonner';

export default function AcademiasPage() {
  const { data: academias, isLoading } = useAcademias();
  const deleteAcademia = useDeleteAcademia();

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a academia "${nome}"?`)) {
      return;
    }

    try {
      await deleteAcademia.mutateAsync(id);
      toast.success('Academia excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir academia');
    }
  };

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Academias</h1>
        <Link
          href="/dashboard/academias/nova"
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nova Academia
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {academias && academias.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Raio (m)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {academias.map((academia) => (
                    <tr key={academia.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{academia.nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{academia.endereco}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {academia.latitude.toFixed(6)}, {academia.longitude.toFixed(6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{academia.raio}m</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/dashboard/academias/${academia.id}/editar`}
                          className="text-primary hover:opacity-80"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(academia.id, academia.nome)}
                          className="text-red-600 hover:opacity-80"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {academias.map((academia) => (
                <div key={academia.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">{academia.nome}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{academia.endereco}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {academia.latitude.toFixed(6)}, {academia.longitude.toFixed(6)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Raio: {academia.raio}m</div>
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/academias/${academia.id}/editar`}
                          className="text-primary hover:opacity-80 text-sm"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(academia.id, academia.nome)}
                          className="text-red-600 hover:opacity-80 text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Nenhuma academia cadastrada ainda.</div>
        )}
      </div>
    </div>
  );
}
