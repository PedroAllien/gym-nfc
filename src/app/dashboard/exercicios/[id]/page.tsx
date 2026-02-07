'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useExercicio } from '@/hooks/use-exercicios';
import { useAcademia } from '@/hooks/use-academias';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import { QRCodeGenerator } from '@/components/shared/QRCodeGenerator';
import { QRCodePersonalizado } from '@/components/shared/QRCodePersonalizado';
import { QRCodeCardImpressao } from '@/components/shared/QRCodeCardImpressao';
import { AcademiaSelector } from '@/components/shared/AcademiaSelector';
import Link from 'next/link';
import { Copy, Check, QrCode, ExternalLink, Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function ExercicioPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: exercicio, isLoading } = useExercicio(id);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedAcademiaId, setSelectedAcademiaId] = useState<string | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);
  const { data: selectedAcademia } = useAcademia(selectedAcademiaId || 'dummy', {
    enabled: !!selectedAcademiaId,
  });

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
              {showQRCode && (
                <button
                  onClick={() => setShowPrintView(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm">Imprimir Card</span>
                </button>
              )}
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
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecionar Academia para Personalização (Opcional)
              </label>
              <AcademiaSelector
                selectedAcademiaId={selectedAcademiaId}
                onSelect={setSelectedAcademiaId}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Selecione uma academia para gerar um QR Code personalizado com o logo da academia
              </p>
            </div>
            <div className="flex justify-center">
              {selectedAcademiaId && selectedAcademia ? (
                <QRCodePersonalizado
                  url={nfcUrl}
                  academiaLogoUrl={selectedAcademia.logoUrl}
                  academiaNome={selectedAcademia.nome}
                  tipo="exercicio"
                  nomeItem={exercicio.nome}
                  size={250}
                />
              ) : (
                <QRCodeGenerator url={nfcUrl} size={200} />
              )}
            </div>
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

      {showPrintView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Visualização para Impressão</h2>
              <button
                onClick={() => setShowPrintView(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Instruções:</strong> Clique em "Imprimir" e configure para imprimir em papel de 85mm x 54mm (tamanho de cartão).
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                >
                  Imprimir
                </button>
                <button
                  onClick={() => setShowPrintView(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div className="print:flex print:justify-center print:items-center print:min-h-screen print:bg-white">
              <QRCodeCardImpressao
                url={nfcUrl}
                academiaLogoUrl={selectedAcademia?.logoUrl}
                academiaNome={selectedAcademia?.nome}
                tipo="exercicio"
                nomeItem={exercicio.nome}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
