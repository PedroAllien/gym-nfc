'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { academiaSchema, type AcademiaFormData } from '@/schemas/academia.schema';
import { useAcademia, useUpdateAcademia } from '@/hooks/use-academias';
import { MapPicker } from '@/components/shared/MapPicker';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { uploadAcademiaLogo, deleteAcademiaLogo } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';

export default function EditarAcademiaPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: academia, isLoading } = useAcademia(id, { includeInactive: true });
  const updateAcademia = useUpdateAcademia();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AcademiaFormData>({
    resolver: zodResolver(academiaSchema),
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    if (academia) {
      setLogoUrl(academia.logoUrl || null);
      reset({
        nome: academia.nome,
        endereco: academia.endereco,
        latitude: academia.latitude,
        longitude: academia.longitude,
        raio: academia.raio,
        logoUrl: academia.logoUrl || null,
      });
    }
  }, [academia, reset]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada pelo navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude);
        setValue('longitude', position.coords.longitude);
        setIsGettingLocation(false);
        toast.success('Localização obtida com sucesso!');
      },
      (error) => {
        setIsGettingLocation(false);
        if (error.code === 1) {
          toast.error('Permissão de localização negada');
        } else {
          toast.error('Erro ao obter localização');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleLogoUpload = async (file: File): Promise<string> => {
    setIsUploadingLogo(true);
    try {
      if (academia?.logoUrl) {
        await deleteAcademiaLogo(academia.logoUrl);
      }
      const url = await uploadAcademiaLogo(file, id);
      setLogoUrl(url);
      setValue('logoUrl', url);
      setIsUploadingLogo(false);
      return url;
    } catch (error) {
      setIsUploadingLogo(false);
      toast.error('Erro ao fazer upload da logo');
      throw error;
    }
  };

  const handleLogoRemove = async () => {
    if (academia?.logoUrl) {
      await deleteAcademiaLogo(academia.logoUrl);
    }
    setLogoUrl(null);
    setValue('logoUrl', null);
  };

  const onSubmit = async (data: AcademiaFormData) => {
    try {
      await updateAcademia.mutateAsync({ id, data: { ...data, logoUrl } });
      toast.success('Academia atualizada com sucesso!');
      router.push('/dashboard/academias');
    } catch (error) {
      toast.error('Erro ao atualizar academia');
    }
  };

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando...</div>;
  }

  if (!academia) {
    return <div className="text-gray-600 dark:text-gray-400">Academia não encontrada</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Editar Academia</h1>

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
          <ImageUpload
            currentImageUrl={logoUrl}
            onImageUpload={handleLogoUpload}
            onImageRemove={handleLogoRemove}
            label="Logo da Academia"
          />
        </div>

        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço *
          </label>
          <input
            type="text"
            id="endereco"
            {...register('endereco')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {errors.endereco && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endereco.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.latitude.message}</p>}
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.longitude.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecionar Localização no Mapa
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Pesquise pelo nome do estabelecimento ou endereço, ou clique no mapa para selecionar a localização
          </p>
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onLocationSelect={(lat, lng) => {
              setValue('latitude', lat);
              setValue('longitude', lng);
            }}
            height="400px"
          />
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2 text-sm text-primary hover:opacity-80 disabled:opacity-50"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Obtendo localização...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Usar minha localização atual
                </>
              )}
            </button>
            {latitude && longitude && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="raio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Raio de Cobertura (metros) *
          </label>
          <input
            type="number"
            id="raio"
            min="1"
            max="10000"
            {...register('raio', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Distância máxima em metros que o usuário pode estar da academia para acessar o conteúdo NFC
          </p>
          {errors.raio && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.raio.message}</p>}
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
