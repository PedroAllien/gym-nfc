'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useExercicio } from '@/hooks/use-exercicios';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { QRCodeGenerator } from '@/components/shared/QRCodeGenerator';
import Link from 'next/link';
import { Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ExercicioPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: exercicio, isLoading } = useExercicio(id);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const nfcUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/nfc/exercicios/${id}`
    : `/nfc/exercicios/${id}`;

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

  if (!exercicio) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600 dark:text-gray-400">Exercício não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{exercicio.nome}</h1>
        <Link
          href={`/dashboard/exercicios/${id}/editar`}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 text-center sm:text-left"
        >
          Editar
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Link Público NFC</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Compartilhe este link ou escaneie o QR Code para acessar o exercício sem precisar fazer login.
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

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Categoria</h2>
          <p className="text-gray-600 dark:text-gray-400">{exercicio.categoria.nome}</p>
        </div>

        {exercicio.descricao && (
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Descrição</h2>
            <p className="text-gray-600 dark:text-gray-400">{exercicio.descricao}</p>
          </div>
        )}

        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">Vídeo</h2>
          <VideoPlayer youtubeId={exercicio.youtubeId} vertical />
        </div>
      </div>
    </div>
  );
}
