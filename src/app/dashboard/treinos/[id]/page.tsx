'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useTreino } from '@/hooks/use-treinos';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { QRCodeGenerator } from '@/components/shared/QRCodeGenerator';
import { Accordion } from '@/components/shared/Accordion';
import Link from 'next/link';
import { Copy, Check, QrCode, ExternalLink, PlayCircle, Clock, Repeat } from 'lucide-react';
import { toast } from 'sonner';

export default function TreinoPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: treino, isLoading } = useTreino(id);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const nfcUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/nfc/${id}`
    : `/nfc/${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(nfcUrl);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600 dark:text-gray-400">Treino não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{treino.nome}</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/treinos/${id}/editar`}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 text-center"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Link Público NFC</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Compartilhe este link ou escaneie o QR Code para acessar o treino sem precisar fazer login.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={nfcUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-900 dark:text-white"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-sm">{showQRCode ? 'Ocultar' : 'Mostrar'} QR Code</span>
              </button>
              <a
                href={nfcUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Abrir</span>
              </a>
            </div>
          </div>
        </div>
        {showQRCode && (
          <div className="mt-4 flex justify-center">
            <QRCodeGenerator url={nfcUrl} size={200} />
          </div>
        )}
      </div>

      {treino.descricao && (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{treino.descricao}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exercícios ({treino.exercicios.length})
          </h2>
        </div>
        {treino.exercicios.map((treinoExercicio, index) => (
          <Accordion
            key={treinoExercicio.id}
            defaultOpen={index === 0}
            title={
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 dark:bg-red-700 text-white flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {treinoExercicio.exercicio.nome}
                </h3>
              </div>
            }
          >
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {treinoExercicio.series && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Repeat className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Séries</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {treinoExercicio.series}
                    </p>
                  </div>
                )}
                {treinoExercicio.repeticoes && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <PlayCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Repetições</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {treinoExercicio.repeticoes}
                    </p>
                  </div>
                )}
                {treinoExercicio.descanso && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Descanso</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {treinoExercicio.descanso}
                    </p>
                  </div>
                )}
              </div>

              {treinoExercicio.observacao && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Observação:</strong> {treinoExercicio.observacao}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Demonstração
                </h4>
                <VideoPlayer youtubeId={treinoExercicio.exercicio.youtubeId} vertical />
              </div>

              {treinoExercicio.exercicio.descricao && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição do Exercício
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {treinoExercicio.exercicio.descricao}
                  </p>
                </div>
              )}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
