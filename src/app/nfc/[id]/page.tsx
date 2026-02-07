'use client';

import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { Accordion } from '@/components/shared/Accordion';
import { Logo } from '@/components/shared/Logo';
import { ChatBot } from '@/components/shared/ChatBot';
import { useTreinoPublic } from '@/hooks/use-treino-public';
import { formatTreinoContext } from '@/lib/chat-context';
import { Repeat, PlayCircle, Clock } from 'lucide-react';

export default function NFCPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: treino, isLoading } = useTreinoPublic(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Treino não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8 px-2 py-4">
          <Logo width={250} height={80} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2 text-center">{treino.nome}</h1>
        {treino.descricao && (
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base px-2">{treino.descricao}</p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-white">
              Exercícios ({treino.exercicios.length})
            </h2>
          </div>
          {treino.exercicios.map((treinoExercicio, index) => (
            <Accordion
              key={treinoExercicio.id}
              defaultOpen={index === 0}
              darkOnly
              title={
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-white">
                    {treinoExercicio.exercicio.nome}
                  </h3>
                </div>
              }
            >
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {treinoExercicio.series && (
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Repeat className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-gray-300">Séries</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {treinoExercicio.series}
                      </p>
                    </div>
                  )}
                  {treinoExercicio.repeticoes && (
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <PlayCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-gray-300">Repetições</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {treinoExercicio.repeticoes}
                      </p>
                    </div>
                  )}
                  {treinoExercicio.descanso && (
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-gray-300">Descanso</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {treinoExercicio.descanso}
                      </p>
                    </div>
                  )}
                </div>

                {treinoExercicio.observacao && (
                  <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-3">
                    <p className="text-sm text-blue-300">
                      <strong>Observação:</strong> {treinoExercicio.observacao}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Demonstração
                  </h4>
                  <VideoPlayer youtubeId={treinoExercicio.exercicio.youtubeId} vertical />
                </div>

                {treinoExercicio.exercicio.descricao && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">
                      Descrição do Exercício
                    </h4>
                    <p className="text-sm text-gray-400">
                      {treinoExercicio.exercicio.descricao}
                    </p>
                  </div>
                )}
              </div>
            </Accordion>
          ))}
        </div>
      </div>
      {treino && (
        <ChatBot
          context={formatTreinoContext(treino)}
          type="treino"
        />
      )}
    </div>
  );
}
