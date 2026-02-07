'use client';

import { useState } from 'react';
import { useAcademias } from '@/hooks/use-academias';
import { Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface AcademiaSelectorProps {
  selectedAcademiaId?: string | null;
  onSelect: (academiaId: string | null) => void;
}

export function AcademiaSelector({ selectedAcademiaId, onSelect }: AcademiaSelectorProps) {
  const { data: academias, isLoading } = useAcademias();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Carregando academias...</span>
      </div>
    );
  }

  const selectedAcademia = academias?.find((a) => a.id === selectedAcademiaId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-sm">
          {selectedAcademia ? selectedAcademia.nome : 'Selecionar Academia (opcional)'}
        </span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-colors flex items-center gap-3 ${
                !selectedAcademiaId ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Sem academia</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">QR Code padrão</p>
              </div>
              {!selectedAcademiaId && <Check className="w-4 h-4 text-primary" />}
            </button>
            {academias?.map((academia) => (
              <button
                key={academia.id}
                type="button"
                onClick={() => {
                  onSelect(academia.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors flex items-center gap-3 ${
                  selectedAcademiaId === academia.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {academia.logoUrl && (
                  <div className="w-10 h-10 rounded overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={academia.logoUrl}
                      alt={academia.nome}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{academia.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{academia.endereco}</p>
                </div>
                {selectedAcademiaId === academia.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
