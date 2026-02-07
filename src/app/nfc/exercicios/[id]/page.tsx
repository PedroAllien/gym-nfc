'use client';

import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { Logo } from '@/components/shared/Logo';
import { ChatBot } from '@/components/shared/ChatBot';
import { useExercicioPublic } from '@/hooks/use-exercicio-public';
import { formatExercicioContext } from '@/lib/chat-context';

export default function ExercicioNFCPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: exercicio, isLoading } = useExercicioPublic(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!exercicio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Exercício não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8 px-2 py-4">
          <Logo width={250} height={80} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2 text-center">{exercicio.nome}</h1>
        
        {exercicio.categoria && (
          <div className="mb-3 sm:mb-4 px-2">
            <span className="bg-gray-700 px-3 py-1 rounded text-sm">{exercicio.categoria.nome}</span>
          </div>
        )}

        {exercicio.descricao && (
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base px-2">{exercicio.descricao}</p>
        )}

        <div className="bg-gray-800 rounded-lg p-3 sm:p-6">
          <VideoPlayer youtubeId={exercicio.youtubeId} vertical />
        </div>
      </div>
      {exercicio && (
        <ChatBot
          context={formatExercicioContext(exercicio)}
          type="exercicio"
        />
      )}
    </div>
  );
}
