'use client';

import { useState, useMemo } from 'react';
import { useExercicios } from '@/hooks/use-exercicios';
import { useTreinos } from '@/hooks/use-treinos';
import { useAcademias } from '@/hooks/use-academias';
import { AcademiaSelector } from '@/components/shared/AcademiaSelector';
import { Download, Search, CheckSquare, Square, X, Dumbbell, Calendar } from 'lucide-react';
import { APP_URL } from '@/lib/constants';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { generateQRCodeImageData } from '@/lib/qrcode-utils';

type SelectedItem = {
  id: string;
  nome: string;
  tipo: 'exercicio' | 'treino';
};

type TabType = 'exercicios' | 'treinos';

export default function QRCodesPage() {
  const { data: exercicios, isLoading: isLoadingExercicios } = useExercicios();
  const { data: treinos, isLoading: isLoadingTreinos } = useTreinos();
  const { data: academias } = useAcademias();
  
  const [activeTab, setActiveTab] = useState<TabType>('exercicios');
  const [selectedExercicios, setSelectedExercicios] = useState<Set<string>>(new Set());
  const [selectedTreinos, setSelectedTreinos] = useState<Set<string>>(new Set());
  const [showAcademiaModal, setShowAcademiaModal] = useState(false);
  const [selectedAcademiaId, setSelectedAcademiaId] = useState<string | null>(null);
  const [searchExercicios, setSearchExercicios] = useState('');
  const [searchTreinos, setSearchTreinos] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredExercicios = useMemo(() => {
    if (!exercicios) return [];
    if (!searchExercicios.trim()) return exercicios;
    return exercicios.filter((ex) =>
      ex.nome.toLowerCase().includes(searchExercicios.toLowerCase())
    );
  }, [exercicios, searchExercicios]);

  const filteredTreinos = useMemo(() => {
    if (!treinos) return [];
    if (!searchTreinos.trim()) return treinos;
    return treinos.filter((t) =>
      t.nome.toLowerCase().includes(searchTreinos.toLowerCase())
    );
  }, [treinos, searchTreinos]);

  const toggleExercicio = (id: string) => {
    const newSet = new Set(selectedExercicios);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedExercicios(newSet);
  };

  const toggleTreino = (id: string) => {
    const newSet = new Set(selectedTreinos);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTreinos(newSet);
  };

  const toggleAllExercicios = () => {
    if (selectedExercicios.size === filteredExercicios.length) {
      setSelectedExercicios(new Set());
    } else {
      setSelectedExercicios(new Set(filteredExercicios.map((ex) => ex.id)));
    }
  };

  const toggleAllTreinos = () => {
    if (selectedTreinos.size === filteredTreinos.length) {
      setSelectedTreinos(new Set());
    } else {
      setSelectedTreinos(new Set(filteredTreinos.map((t) => t.id)));
    }
  };

  const selectedAcademia = academias?.find((a) => a.id === selectedAcademiaId);

  const handleExportClick = () => {
    const totalSelected = selectedExercicios.size + selectedTreinos.size;
    if (totalSelected === 0) {
      toast.error('Selecione pelo menos um exercício ou treino para exportar');
      return;
    }
    setShowAcademiaModal(true);
  };

  const exportToPDF = async (academiaId: string | null) => {
    const selectedItems: SelectedItem[] = [];

    filteredExercicios.forEach((ex) => {
      if (selectedExercicios.has(ex.id)) {
        selectedItems.push({
          id: ex.id,
          nome: ex.nome,
          tipo: 'exercicio',
        });
      }
    });

    filteredTreinos.forEach((t) => {
      if (selectedTreinos.has(t.id)) {
        selectedItems.push({
          id: t.id,
          nome: t.nome,
          tipo: 'treino',
        });
      }
    });

    setIsExporting(true);
    setShowAcademiaModal(false);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const isDarkMode = document.documentElement.classList.contains('dark');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 2;
      const spacing = 1;
      
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      
      const cardsPerRow = 2;
      const cardsPerCol = 2;
      const cardsPerPage = cardsPerRow * cardsPerCol;
      
      const cardWidth = (availableWidth - spacing) / cardsPerRow;
      const cardHeight = (availableHeight - spacing) / cardsPerCol;

      let currentPage = 0;
      let cardIndex = 0;

      for (const item of selectedItems) {
        if (cardIndex > 0 && cardIndex % cardsPerPage === 0) {
          pdf.addPage();
          currentPage++;
          cardIndex = 0;
        }

        const url =
          item.tipo === 'exercicio'
            ? `${APP_URL}/nfc/exercicios/${item.id}`
            : `${APP_URL}/nfc/${item.id}`;

        const academia = academias?.find((a) => a.id === academiaId);
        const qrCodeImage = await generateQRCodeImageData(
          url,
          academia?.logoUrl || null,
          academia?.nome,
          item.tipo,
          item.nome,
          200,
          isDarkMode
        );

        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = qrCodeImage;
        });

        const imageAspectRatio = img.width / img.height;
        const cardAspectRatio = cardWidth / cardHeight;

        const row = Math.floor(cardIndex / cardsPerRow);
        const col = cardIndex % cardsPerRow;
        const x = margin + col * (cardWidth + spacing);
        const y = margin + row * (cardHeight + spacing);

        let finalWidth = cardWidth;
        let finalHeight = cardHeight;
        let finalX = x;
        let finalY = y;

        if (cardAspectRatio > imageAspectRatio) {
          finalWidth = cardHeight * imageAspectRatio;
          finalX = x + (cardWidth - finalWidth) / 2;
        } else {
          finalHeight = cardWidth / imageAspectRatio;
          finalY = y + (cardHeight - finalHeight) / 2;
        }

        pdf.addImage(qrCodeImage, 'PNG', finalX, finalY, finalWidth, finalHeight, undefined, 'FAST');

        cardIndex++;
      }

      const academia = academias?.find((a) => a.id === academiaId);
      const academiaNome = academia?.nome || 'GymNFC';
      const fileName = `qrcodes-${academiaNome.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success(`${selectedItems.length} QR code(s) exportado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmExport = () => {
    exportToPDF(selectedAcademiaId);
  };

  const totalSelected = selectedExercicios.size + selectedTreinos.size;
  const currentSearch = activeTab === 'exercicios' ? searchExercicios : searchTreinos;
  const setCurrentSearch = activeTab === 'exercicios' ? setSearchExercicios : setSearchTreinos;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Codes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione exercícios e treinos para exportar QR codes em PDF
          </p>
        </div>
        <button
          onClick={handleExportClick}
          disabled={totalSelected === 0 || isExporting}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Exportando...' : `Exportar (${totalSelected})`}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 p-1">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all rounded-lg ${
              activeTab === 'exercicios'
                ? 'bg-red-600 dark:bg-red-700 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            Exercícios
            {selectedExercicios.size > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {selectedExercicios.size}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('treinos')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all rounded-lg ${
              activeTab === 'treinos'
                ? 'bg-red-600 dark:bg-red-700 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Treinos
            {selectedTreinos.size > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {selectedTreinos.size}
              </span>
            )}
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeTab === 'exercicios' ? 'Exercícios' : 'Treinos'}
            </h2>
            {((activeTab === 'exercicios' && filteredExercicios.length > 0) ||
              (activeTab === 'treinos' && filteredTreinos.length > 0)) && (
              <button
                onClick={activeTab === 'exercicios' ? toggleAllExercicios : toggleAllTreinos}
                className="text-sm text-primary hover:opacity-80"
              >
                {activeTab === 'exercicios'
                  ? selectedExercicios.size === filteredExercicios.length
                    ? 'Desmarcar todos'
                    : 'Marcar todos'
                  : selectedTreinos.size === filteredTreinos.length
                  ? 'Desmarcar todos'
                  : 'Marcar todos'}
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'exercicios' ? 'Pesquisar exercícios...' : 'Pesquisar treinos...'}
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {activeTab === 'exercicios' ? (
            isLoadingExercicios ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Carregando...
              </div>
            ) : filteredExercicios && filteredExercicios.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">
                      <span className="sr-only">Selecionar</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Categoria
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExercicios.map((exercicio) => {
                    const isSelected = selectedExercicios.has(exercicio.id);
                    return (
                      <tr
                        key={exercicio.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                          isSelected ? 'bg-red-50 dark:bg-red-950/20' : ''
                        }`}
                        onClick={() => toggleExercicio(exercicio.id)}
                      >
                        <td className="px-4 py-3">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {exercicio.nome}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {exercicio.categoria.nome}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Nenhum exercício encontrado
              </div>
            )
          ) : (
            isLoadingTreinos ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Carregando...
              </div>
            ) : filteredTreinos && filteredTreinos.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-12">
                      <span className="sr-only">Selecionar</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Exercícios
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTreinos.map((treino) => {
                    const isSelected = selectedTreinos.has(treino.id);
                    return (
                      <tr
                        key={treino.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                          isSelected ? 'bg-red-50 dark:bg-red-950/20' : ''
                        }`}
                        onClick={() => toggleTreino(treino.id)}
                      >
                        <td className="px-4 py-3">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {treino.nome}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {treino.exercicios.length} exercício(s)
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Nenhum treino encontrado
              </div>
            )
          )}
        </div>
      </div>

      {showAcademiaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Selecionar Academia
              </h2>
              <button
                onClick={() => setShowAcademiaModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Selecione uma academia para personalizar os QR codes (opcional)
              </p>
              <AcademiaSelector
                selectedAcademiaId={selectedAcademiaId}
                onSelect={setSelectedAcademiaId}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAcademiaModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmExport}
                disabled={isExporting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
