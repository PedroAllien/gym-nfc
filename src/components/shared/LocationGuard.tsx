'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useAcademiasPublic } from '@/hooks/use-academias';
import { getUserLocation, isWithinRadius } from '@/lib/geolocation';
import type { Academia } from '@/types/academia';

interface LocationGuardProps {
  children: React.ReactNode;
}

export function LocationGuard({ children }: LocationGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { data: academias, isLoading: isLoadingAcademias } = useAcademiasPublic();

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);

        if (!academias || academias.length === 0) {
          setError('Nenhuma academia cadastrada. Entre em contato com o administrador.');
          setIsChecking(false);
          return;
        }

        const isInAnyAcademia = academias.some((academia: Academia) =>
          isWithinRadius(
            location.latitude,
            location.longitude,
            academia.latitude,
            academia.longitude,
            academia.raio
          )
        );

        if (isInAnyAcademia) {
          setIsAuthorized(true);
        } else {
          setError('Você precisa estar dentro de uma academia cadastrada para acessar este conteúdo.');
        }
      } catch (err: any) {
        if (err.code === 1) {
          setError('Permissão de localização negada. Por favor, permita o acesso à sua localização para continuar.');
        } else if (err.code === 2) {
          setError('Não foi possível determinar sua localização. Verifique sua conexão e tente novamente.');
        } else if (err.code === 3) {
          setError('Tempo de espera esgotado. Tente novamente.');
        } else {
          setError('Erro ao verificar localização. Tente novamente.');
        }
      } finally {
        setIsChecking(false);
      }
    };

    if (!isLoadingAcademias) {
      checkLocation();
    }
  }, [academias, isLoadingAcademias]);

  if (isChecking || isLoadingAcademias) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-red-600" />
          <p className="text-lg">Verificando localização...</p>
          <p className="text-sm text-gray-400 mt-2">Por favor, permita o acesso à sua localização</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <h2 className="text-xl font-bold">Acesso Restrito</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          {userLocation && (
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Sua localização:</span>
              </div>
              <div className="text-sm text-white">
                <div>Lat: {userLocation.latitude.toFixed(6)}</div>
                <div>Lon: {userLocation.longitude.toFixed(6)}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <h2 className="text-xl font-bold">Acesso Restrito</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Você precisa estar dentro de uma academia cadastrada para acessar este conteúdo.
          </p>
          {userLocation && (
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Sua localização:</span>
              </div>
              <div className="text-sm text-white">
                <div>Lat: {userLocation.latitude.toFixed(6)}</div>
                <div>Lon: {userLocation.longitude.toFixed(6)}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Verificar Novamente
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
