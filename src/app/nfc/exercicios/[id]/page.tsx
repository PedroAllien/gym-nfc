'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { Logo } from '@/components/shared/Logo';
import { ChatBot } from '@/components/shared/ChatBot';
import { LocationGuard } from '@/components/shared/LocationGuard';
import { useExercicioPublic } from '@/hooks/use-exercicio-public';
import { formatExercicioContext } from '@/lib/chat-context';
import { Sparkles, MessageCircle, Zap, X } from 'lucide-react';
import type { Academia } from '@/types/academia';

export default function ExercicioNFCPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: exercicio, isLoading } = useExercicioPublic(id);
  const [showIACard, setShowIACard] = useState(true);
  const [openChat, setOpenChat] = useState(false);

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
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2 text-center">{exercicio.nome}</h1>
        
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
                    Tem dúvidas sobre este exercício? Converse com nosso personal trainer inteligente! 
                    Tire todas as suas perguntas sobre técnica, execução, músculos trabalhados e muito mais em tempo real.
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
            openChat={openChat}
            onOpenChange={setOpenChat}
          />
        )}
      </div>
      )}
    </LocationGuard>
  );
}
