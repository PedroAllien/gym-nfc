'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exercicioSchema, type ExercicioFormData } from '@/schemas/exercicio.schema';
import { useCreateExercicio } from '@/hooks/use-exercicios';
import { useCategorias } from '@/hooks/use-categorias';
import { toast } from 'sonner';

export default function NovoExercicioPage() {
  const router = useRouter();
  const { data: categorias } = useCategorias();
  const createExercicio = useCreateExercicio();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExercicioFormData>({
    resolver: zodResolver(exercicioSchema),
  });

  const onSubmit = async (data: ExercicioFormData) => {
    try {
      await createExercicio.mutateAsync(data);
      toast.success('Exercício criado com sucesso!');
      router.push('/dashboard/exercicios');
    } catch (error) {
      toast.error('Erro ao criar exercício');
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Novo Exercício</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome *
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

        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL do YouTube *
          </label>
          <input
            type="url"
            id="youtubeUrl"
            {...register('youtubeUrl')}
            placeholder="https://www.youtube.com/watch?v=... ou https://youtube.com/shorts/..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.youtubeUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.youtubeUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria *
          </label>
          <select
            id="categoriaId"
            {...register('categoriaId')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Selecione uma categoria</option>
            {categorias?.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoriaId.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
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
