'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { Logo } from './Logo';

interface QRCodeCardImpressaoProps {
  url: string;
  academiaLogoUrl?: string | null;
  academiaNome?: string;
  tipo: 'exercicio' | 'treino';
  nomeItem: string;
}

export function QRCodeCardImpressao({
  url,
  academiaLogoUrl,
  academiaNome,
  tipo,
  nomeItem,
}: QRCodeCardImpressaoProps) {
  return (
    <div className="w-[85mm] h-[54mm] bg-white p-4 flex flex-col items-center justify-between border-2 border-gray-300 rounded-lg print:border-0 print:rounded-none">
      <div className="flex items-center justify-between w-full mb-2">
        {academiaLogoUrl ? (
          <div className="w-16 h-16 rounded overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
            <Image
              src={academiaLogoUrl}
              alt={academiaNome || 'Logo'}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        ) : (
          <Logo width={80} height={30} />
        )}
        <div className="bg-white p-2 rounded">
          <QRCodeSVG value={url} size={80} level="M" />
        </div>
      </div>
      <div className="text-center w-full">
        {academiaNome && (
          <p className="text-xs font-semibold text-gray-900 mb-1">{academiaNome}</p>
        )}
        <p className="text-[10px] font-medium text-gray-700 mb-1">
          {tipo === 'exercicio' ? 'EXERCÍCIO' : 'TREINO'}
        </p>
        <p className="text-[9px] text-gray-600 line-clamp-2">{nomeItem}</p>
      </div>
    </div>
  );
}
