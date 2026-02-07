'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { Logo } from './Logo';

interface QRCodePersonalizadoProps {
  url: string;
  academiaLogoUrl?: string | null;
  academiaNome?: string;
  tipo: 'exercicio' | 'treino';
  nomeItem: string;
  size?: number;
}

export function QRCodePersonalizado({
  url,
  academiaLogoUrl,
  academiaNome,
  tipo,
  nomeItem,
  size = 200,
}: QRCodePersonalizadoProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {academiaLogoUrl && (
        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Image
            src={academiaLogoUrl}
            alt={academiaNome || 'Logo da Academia'}
            width={96}
            height={96}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      )}
      {!academiaLogoUrl && (
        <div className="flex items-center justify-center">
          <Logo width={120} height={40} />
        </div>
      )}
      {academiaNome && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
          {academiaNome}
        </h3>
      )}
      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG value={url} size={size} level="M" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {tipo === 'exercicio' ? 'Exercício' : 'Treino'}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px] break-words">
          {nomeItem}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center max-w-[200px] break-all">
        {url}
      </p>
    </div>
  );
}
