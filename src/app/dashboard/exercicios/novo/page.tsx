'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExercicioSchema, type CreateExercicioFormData } from '@/schemas/exercicio.schema';
import { useCreateExercicio } from '@/hooks/use-exercicios';
import { useCategorias } from '@/hooks/use-categorias';
import { toast } from 'sonner';
import { useRef } from 'react';
import type { VideoSource } from '@/types/exercicio';

export default function NovoExercicioPage() {
  const router = useRouter();
  const { data: categorias } = useCategorias();
  const createExercicio = useCreateExercicio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateExercicioFormData>({
    resolver: zodResolver(createExercicioSchema),
    defaultValues: { videoSource: 'file', videoFile: null, videoUrl: '' },
  });

  const videoSource = watch('videoSource');
  const videoFile = watch('videoFile');
  const videoUrl = watch('videoUrl');

  const onSubmit = async (data: CreateExercicioFormData) => {
    try {
      await createExercicio.mutateAsync({
        nome: data.nome,
        descricao: data.descricao,
        categoriaId: data.categoriaId,
        videoSource: data.videoSource as VideoSource,
        videoFile: data.videoSource === 'file' ? (data.videoFile ?? fileInputRef.current?.files?.[0]) : undefined,
        videoUrl: data.videoSource === 'url' ? data.videoUrl?.trim() : undefined,
      });
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
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vídeo do exercício *</span>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="file"
                {...register('videoSource', { onChange: () => { setValue('videoUrl', ''); setValue('videoFile', null); } })}
                className="text-primary focus:ring-primary"
              />
              <span>Enviar arquivo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="url"
                {...register('videoSource', { onChange: () => setValue('videoFile', null) })}
                className="text-primary focus:ring-primary"
              />
              <span>URL (YouTube ou Vimeo)</span>
            </label>
          </div>

          {videoSource === 'file' && (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">MP4, WebM ou MOV, máx. 50MB. O vídeo será comprimido antes do envio.</p>
              <input
                ref={fileInputRef}
                type="file"
                id="videoFile"
                accept="video/mp4,video/webm,video/quicktime"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white file:text-sm"
                onChange={(e) => setValue('videoFile', e.target.files?.[0] ?? null, { shouldValidate: true })}
              />
              {videoFile && videoFile instanceof File && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{videoFile.name}</p>
              )}
            </>
          )}

          {videoSource === 'url' && (
            <>
              <input
                type="url"
                id="videoUrl"
                {...register('videoUrl', { onBlur: (e) => setValue('videoUrl', e.target.value?.trim() ?? '', { shouldValidate: true }) })}
                placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </>
          )}

          {(errors.videoFile?.message ?? errors.videoUrl?.message) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.videoFile?.message ?? errors.videoUrl?.message}</p>
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
