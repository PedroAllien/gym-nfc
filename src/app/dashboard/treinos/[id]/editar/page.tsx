'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { treinoSchema, type TreinoFormData } from '@/schemas/treino.schema';
import { useTreino, useUpdateTreino } from '@/hooks/use-treinos';
import { useExercicios } from '@/hooks/use-exercicios';
import { toast } from 'sonner';
import { Plus, X, GripVertical } from 'lucide-react';

export default function EditarTreinoPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: treino, isLoading } = useTreino(id);
  const { data: exercicios } = useExercicios();
  const updateTreino = useUpdateTreino();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TreinoFormData>({
    resolver: zodResolver(treinoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      exercicios: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'exercicios',
  });

  useEffect(() => {
    if (treino) {
      reset({
        nome: treino.nome,
        descricao: treino.descricao || '',
        exercicios: treino.exercicios.map((te) => ({
          exercicioId: te.exercicioId,
          ordem: te.ordem,
          series: te.series || undefined,
          repeticoes: te.repeticoes || '',
          descanso: te.descanso || '',
          observacao: te.observacao || '',
        })),
      });
    }
  }, [treino, reset]);

  const adicionarExercicio = () => {
    append({
      exercicioId: '',
      ordem: fields.length + 1,
      series: undefined,
      repeticoes: '',
      descanso: '',
      observacao: '',
    });
  };

  const onSubmit = async (data: TreinoFormData) => {
    try {
      await updateTreino.mutateAsync({ id, data });
      toast.success('Treino atualizado com sucesso!');
      router.push(`/dashboard/treinos/${id}`);
    } catch (error) {
      toast.error('Erro ao atualizar treino');
    }
  };

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  if (!treino) {
    return <div className="text-gray-600 dark:text-gray-400">Treino não encontrado</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Editar Treino</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Treino *
            </label>
            <input
              type="text"
              id="nome"
              {...register('nome')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            {errors.nome && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nome.message}</p>}
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              {...register('descricao')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Exercícios</h2>
            <button
              type="button"
              onClick={adicionarExercicio}
              className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Adicionar Exercício
            </button>
          </div>

          {errors.exercicios && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errors.exercicios.message}</p>
          )}

          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum exercício adicionado ainda.</p>
              <p className="text-sm mt-2">Clique em "Adicionar Exercício" para começar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const exercicioError = errors.exercicios?.[index];
                return (
                  <div
                    key={field.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <GripVertical className="w-5 h-5" />
                        <span className="font-medium">Exercício {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exercício *
                      </label>
                      <select
                        {...register(`exercicios.${index}.exercicioId`)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Selecione um exercício</option>
                        {exercicios?.map((exercicio) => (
                          <option key={exercicio.id} value={exercicio.id}>
                            {exercicio.nome} ({exercicio.categoria.nome})
                          </option>
                        ))}
                      </select>
                      {exercicioError?.exercicioId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {exercicioError.exercicioId.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Séries
                        </label>
                        <input
                          type="number"
                          min="1"
                          {...register(`exercicios.${index}.series`, { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Ex: 3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Repetições
                        </label>
                        <input
                          type="text"
                          {...register(`exercicios.${index}.repeticoes`)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Ex: 12-15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Descanso
                        </label>
                        <input
                          type="text"
                          {...register(`exercicios.${index}.descanso`)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Ex: 60s"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ordem
                        </label>
                        <input
                          type="number"
                          min="1"
                          {...register(`exercicios.${index}.ordem`, { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          value={index + 1}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observação
                      </label>
                      <textarea
                        {...register(`exercicios.${index}.observacao`)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Notas adicionais sobre este exercício..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting || fields.length === 0}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
