'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, MapPin } from 'lucide-react';
import { useAcademias } from '@/hooks/use-academias';
import { useDeleteAcademia, useActivateAcademia } from '@/hooks/use-academias';
import { Logo } from '@/components/shared/Logo';
import { toast } from 'sonner';

type StatusFilter = 'todos' | 'ativo' | 'inativo';

export default function AcademiasPage() {
  const [filtroStatus, setFiltroStatus] = useState<StatusFilter>('todos');
  const { data: academias, isLoading } = useAcademias(filtroStatus);
  const deleteAcademia = useDeleteAcademia();
  const activateAcademia = useActivateAcademia();

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

  const handleActivate = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja ativar a academia "${nome}"?`)) {
      return;
    }

    try {
      await activateAcademia.mutateAsync(id);
      toast.success('Academia ativada com sucesso!');
    } catch (error) {
      toast.error('Erro ao ativar academia');
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por status:</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as StatusFilter)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativas</option>
              <option value="inativo">Inativas</option>
            </select>
          </div>
        </div>

        {academias && academias.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Status
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
                    <tr 
                      key={academia.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!academia.ativo ? 'opacity-60' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {academia.logoUrl ? (
                            <Image
                              src={academia.logoUrl}
                              alt={academia.nome}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <Logo width={32} height={16} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{academia.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            academia.ativo
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {academia.ativo ? 'Ativa' : 'Inativa'}
                        </span>
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
                        {academia.ativo ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={() => handleActivate(academia.id, academia.nome)}
                            className="text-green-600 hover:opacity-80"
                          >
                            Ativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {academias.map((academia) => (
                <div 
                  key={academia.id} 
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!academia.ativo ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 rounded overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {academia.logoUrl ? (
                        <Image
                          src={academia.logoUrl}
                          alt={academia.nome}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <Logo width={32} height={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-gray-900 dark:text-white">{academia.nome}</div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            academia.ativo
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {academia.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{academia.endereco}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {academia.latitude.toFixed(6)}, {academia.longitude.toFixed(6)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Raio: {academia.raio}m</div>
                      <div className="flex gap-3">
                        {academia.ativo ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={() => handleActivate(academia.id, academia.nome)}
                            className="text-green-600 hover:opacity-80 text-sm"
                          >
                            Ativar
                          </button>
                        )}
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
