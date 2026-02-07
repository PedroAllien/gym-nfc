'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Loader2, Sparkles, MessageCircle, Dumbbell, Zap } from 'lucide-react';
import { useAcademiasPublic } from '@/hooks/use-academias';
import { getUserLocation, isWithinRadius } from '@/lib/geolocation';
import { Logo } from '@/components/shared/Logo';
import type { Academia } from '@/types/academia';

interface LocationGuardProps {
  children: React.ReactNode | ((academia: Academia | null) => React.ReactNode);
}

export function LocationGuard({ children }: LocationGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [academiaDetectada, setAcademiaDetectada] = useState<Academia | null>(null);
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

        const academiaEncontrada = academias.find((academia: Academia) =>
          isWithinRadius(
            location.latitude,
            location.longitude,
            academia.latitude,
            academia.longitude,
            academia.raio
          )
        );

        if (academiaEncontrada) {
          setAcademiaDetectada(academiaEncontrada);
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

  if (error && error.includes('dentro de uma academia')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex justify-center mb-8">
            <Logo width={280} height={90} />
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600/20 mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Acesso Exclusivo</h1>
              <p className="text-xl text-gray-300 mb-2">
                Este conteúdo está disponível apenas dentro da academia
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-600/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-400">
                    Converse com a Administração da Academia
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Para ter acesso à melhor plataforma de treinos com inteligência artificial, 
                    entre em contato com a administração da sua academia para adicionar ou renovar 
                    o plano da plataforma GymNFC.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">IA Inteligente</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Assistente virtual que tira todas as suas dúvidas sobre exercícios e treinos em tempo real
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Treinos Personalizados</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Acesse treinos completos com exercícios, séries, repetições e vídeos demonstrativos
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Zap className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Acesso Instantâneo</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Escaneie o QR Code ou use o NFC para acessar seus treinos rapidamente na academia
                </p>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Por que escolher GymNFC?
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Inteligência Artificial:</strong> Tire dúvidas sobre qualquer exercício ou treino com nosso assistente virtual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Treinos Completos:</strong> Acesse treinos detalhados com séries, repetições e vídeos demonstrativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Fácil Acesso:</strong> Use NFC ou QR Code para acessar seus treinos instantaneamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Experiência Premium:</strong> A melhor plataforma de treinos disponível para sua academia</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Verificar Novamente
              </button>
            </div>
          </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex justify-center mb-8">
            <Logo width={280} height={90} />
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600/20 mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Acesso Exclusivo</h1>
              <p className="text-xl text-gray-300 mb-2">
                Este conteúdo está disponível apenas dentro da academia
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-600/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-400">
                    Converse com a Administração da Academia
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Para ter acesso à melhor plataforma de treinos com inteligência artificial, 
                    entre em contato com a administração da sua academia para adicionar ou renovar 
                    o plano da plataforma GymNFC.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">IA Inteligente</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Assistente virtual que tira todas as suas dúvidas sobre exercícios e treinos em tempo real
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Treinos Personalizados</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Acesse treinos completos com exercícios, séries, repetições e vídeos demonstrativos
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Zap className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Acesso Instantâneo</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Escaneie o QR Code ou use o NFC para acessar seus treinos rapidamente na academia
                </p>
                </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Por que escolher GymNFC?
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Inteligência Artificial:</strong> Tire dúvidas sobre qualquer exercício ou treino com nosso assistente virtual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Treinos Completos:</strong> Acesse treinos detalhados com séries, repetições e vídeos demonstrativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Fácil Acesso:</strong> Use NFC ou QR Code para acessar seus treinos instantaneamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Experiência Premium:</strong> A melhor plataforma de treinos disponível para sua academia</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Verificar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (typeof children === 'function') {
    return <>{children(academiaDetectada)}</>;
  }

  return <>{children}</>;
}
