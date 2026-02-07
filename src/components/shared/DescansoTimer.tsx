'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react';

interface DescansoTimerProps {
  tempoSegundos: number;
}

export function DescansoTimer({ tempoSegundos }: DescansoTimerProps) {
  const [tempoRestante, setTempoRestante] = useState(tempoSegundos);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && tempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            setShowModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tempoRestante]);

  useEffect(() => {
    if (showModal) {
      modalTimeoutRef.current = setTimeout(() => {
        setShowModal(false);
        setIsRunning(false);
        setIsCompleted(false);
        setTempoRestante(tempoSegundos);
      }, 3000);

      return () => {
        if (modalTimeoutRef.current) {
          clearTimeout(modalTimeoutRef.current);
        }
      };
    }
  }, [showModal, tempoSegundos]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const iniciar = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const pausar = () => {
    setIsRunning(false);
  };

  const resetar = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTempoRestante(tempoSegundos);
    setShowModal(false);
  };

  const porcentagem = (tempoRestante / tempoSegundos) * 100;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Descanso Concluído! ✅
              </h3>
              <p className="text-gray-300 text-sm">
                Hora de continuar o treino!
              </p>
            </div>
          </div>
        </div>
      )}
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-red-400" />
        <span className="text-xs font-medium text-gray-300">Timer de Descanso</span>
      </div>

      <div className="relative mb-4">
        <div className="w-full h-20 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              isCompleted
                ? 'bg-green-600/30'
                : isRunning
                ? 'bg-red-600/20'
                : 'bg-gray-800'
            }`}
            style={{ width: `${porcentagem}%` }}
          />
          <div className="relative z-10">
            <div
              className={`text-3xl sm:text-4xl font-bold ${
                isCompleted
                  ? 'text-green-400'
                  : isRunning
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {formatarTempo(tempoRestante)}
            </div>
            {isCompleted && (
              <div className="text-xs text-green-400 text-center mt-1">Descanso concluído!</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!isRunning && tempoRestante === tempoSegundos && !isCompleted && (
          <button
            onClick={iniciar}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Iniciar Descanso
          </button>
        )}

        {isRunning && (
          <button
            onClick={pausar}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </button>
        )}

        {!isRunning && tempoRestante < tempoSegundos && (
          <button
            onClick={iniciar}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Continuar
          </button>
        )}

        {(tempoRestante < tempoSegundos || isCompleted) && (
          <button
            onClick={resetar}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
    </>
  );
}
