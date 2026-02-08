'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { Accordion } from '@/components/shared/Accordion';
import { Logo } from '@/components/shared/Logo';
import { ChatBot } from '@/components/shared/ChatBot';
import { LocationGuard } from '@/components/shared/LocationGuard';
import { useTreinoPublic } from '@/hooks/use-treino-public';
import { formatTreinoContext } from '@/lib/chat-context';
import { Repeat, PlayCircle, Clock, Check, Trophy, Heart, Sparkles, MessageCircle, Zap, X } from 'lucide-react';
import { DescansoTimer } from '@/components/shared/DescansoTimer';
import type { Academia } from '@/types/academia';
import type { Treino } from '@/types/treino';

export default function NFCPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: treino, isLoading } = useTreinoPublic(id);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [accordionAberto, setAccordionAberto] = useState<string | null>(null);
  const [showIACard, setShowIACard] = useState(true);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    if (treino && exerciciosConcluidos.size === treino.exercicios.length && treino.exercicios.length > 0) {
      setShowModal(true);
    }
  }, [exerciciosConcluidos, treino]);

  useEffect(() => {
    if (treino && treino.exercicios.length > 0) {
      setAccordionAberto(treino.exercicios[0].id);
    }
  }, [treino]);

  const toggleExercicio = (exercicioId: string) => {
    setExerciciosConcluidos((prev) => {
      const novo = new Set(prev);
      if (novo.has(exercicioId)) {
        novo.delete(exercicioId);
      } else {
        novo.add(exercicioId);
      }
      return novo;
    });
  };

  const parsearTempoDescanso = (tempo: string): number => {
    const tempoLower = tempo.toLowerCase().trim();
    
    if (tempoLower.includes('min')) {
      const minutos = parseInt(tempoLower.replace(/[^0-9]/g, '')) || 0;
      return minutos * 60;
    }
    
    if (tempoLower.includes('s') || tempoLower.includes('seg')) {
      const segundos = parseInt(tempoLower.replace(/[^0-9]/g, '')) || 0;
      return segundos;
    }
    
    const numero = parseInt(tempoLower.replace(/[^0-9]/g, '')) || 0;
    return numero < 100 ? numero * 60 : numero;
  };

  const calcularTempoEstimado = (treino: Treino): number => {
    let tempoTotal = 0;
    const tempoPorSerie = 45;
    const tempoDescansoEntreExercicios = 60;

    treino.exercicios.forEach((exercicio, index) => {
      const series = exercicio.series || 3;
      const tempoExercicio = series * tempoPorSerie;
      
      let tempoDescanso = 0;
      if (exercicio.descanso) {
        const descansoSegundos = parsearTempoDescanso(exercicio.descanso);
        tempoDescanso = (series - 1) * descansoSegundos;
      } else {
        tempoDescanso = (series - 1) * 60;
      }

      tempoTotal += tempoExercicio + tempoDescanso;

      if (index < treino.exercicios.length - 1) {
        tempoTotal += tempoDescansoEntreExercicios;
      }
    });

    return Math.ceil(tempoTotal / 60);
  };

  const formatarTempoEstimado = (minutos: number): string => {
    if (minutos < 60) {
      return `${minutos} min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  };

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
    <LocationGuard>
      {(academia: Academia | null) => (
        <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8 px-2 py-4">
            {academia?.logoUrl ? (
              <div className="w-64 h-20 flex items-center justify-center">
                <Image
                  src={academia.logoUrl}
                  alt={academia.nome}
                  width={256}
                  height={80}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <Logo width={250} height={80} />
            )}
          </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2 text-center">{treino.nome}</h1>
        
        <div className="mb-4 px-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-300">Tempo estimado:</span>
            <span className="text-base font-semibold text-white">
              {formatarTempoEstimado(calcularTempoEstimado(treino))}
            </span>
          </div>
        </div>

        {showIACard && (
          <div className="mb-6 px-2">
            <div 
              onClick={() => setOpenChat(true)}
              className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-600/30 rounded-xl p-4 sm:p-5 cursor-pointer hover:from-red-600/30 hover:to-red-700/30 transition-all relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIACard(false);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Fechar card"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-600/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-bold text-white">Personal Trainer IA</h3>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                    Tem dúvidas sobre este treino? Converse com nosso personal trainer inteligente! 
                    Tire todas as suas perguntas sobre exercícios, técnicas, séries e muito mais em tempo real.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-red-600/20 text-red-300 px-2 py-1 rounded">100% Gratuito</span>
                    <span className="bg-red-600/20 text-red-300 px-2 py-1 rounded">Respostas Instantâneas</span>
                    <span className="bg-red-600/20 text-red-300 px-2 py-1 rounded">Disponível 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {treino.descricao && (
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base px-2">{treino.descricao}</p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-white">
              Exercícios ({treino.exercicios.length})
            </h2>
            <div className="text-sm text-gray-400">
              {exerciciosConcluidos.size} / {treino.exercicios.length} concluídos
            </div>
          </div>
          {treino.exercicios.map((treinoExercicio, index) => {
            const isConcluido = exerciciosConcluidos.has(treinoExercicio.id);
            const isAberto = accordionAberto === treinoExercicio.id;
            return (
              <Accordion
                key={treinoExercicio.id}
                isOpen={isAberto}
                onToggle={() => setAccordionAberto(isAberto ? null : treinoExercicio.id)}
                darkOnly
                title={
                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExercicio(treinoExercicio.id);
                      }}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isConcluido
                          ? 'bg-red-600 border-red-600'
                          : 'border-gray-500 hover:border-red-500'
                      }`}
                    >
                      {isConcluido && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <h3 className={`font-semibold flex-1 ${isConcluido ? 'text-red-400 line-through' : 'text-white'}`}>
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

                {treinoExercicio.descanso && (
                  <div className="mt-2">
                    <DescansoTimer
                      tempoSegundos={parsearTempoDescanso(treinoExercicio.descanso)}
                    />
                  </div>
                )}

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
            );
          })}
        </div>
        </div>
        {treino && (
          <ChatBot
            context={formatTreinoContext(treino, exerciciosConcluidos)}
            type="treino"
            openChat={openChat}
            onOpenChange={setOpenChat}
            exerciciosConcluidos={exerciciosConcluidos}
          />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600/20 mb-6">
                  <Trophy className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Parabéns! 🎉
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Treino concluído com sucesso!
                </p>

                <div className="bg-gray-700/50 rounded-xl p-6 mb-6 border border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-semibold text-white">Recomendação de Cardio</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Para completar seu treino de forma ideal, recomendamos realizar uma sessão de cardio de 15-20 minutos.
                  </p>
                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm text-gray-300">Esteira: 15-20 min em ritmo moderado</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm text-gray-300">Bicicleta ergométrica: 20-25 min</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm text-gray-300">Elíptico: 15-20 min</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm text-gray-300">Corda: 3 séries de 3-5 minutos</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-300">
                    <strong>💡 Dica:</strong> O cardio após o treino de força ajuda na recuperação muscular e queima de gordura.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </LocationGuard>
  );
}
