'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

export function QRCodeGenerator({ url, size = 200 }: QRCodeGeneratorProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <QRCodeSVG value={url} size={size} level="M" />
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[200px] break-all">{url}</p>
    </div>
  );
}
