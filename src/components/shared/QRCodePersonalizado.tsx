'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import NextImage from 'next/image';
import { Logo } from './Logo';
import { Download, Printer } from 'lucide-react';

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
  size = 250,
}: QRCodePersonalizadoProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = async () => {
    if (!qrCodeRef.current) return;

    try {
      const container = qrCodeRef.current;
      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isDarkMode = document.documentElement.classList.contains('dark');
      const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
      const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';

      canvas.width = size + 200;
      canvas.height = size + 300;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = document.createElement('img');
      
      img.onload = async () => {
        let yOffset = 20;

        if (academiaLogoUrl) {
          try {
            const logoImg = document.createElement('img');
            logoImg.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              logoImg.onload = resolve;
              logoImg.onerror = reject;
              logoImg.src = academiaLogoUrl!;
            });

            ctx.drawImage(logoImg, (canvas.width - 120) / 2, yOffset, 120, 120);
            yOffset += 140;

            if (academiaNome) {
              ctx.fillStyle = textColor;
              ctx.font = 'bold 20px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(academiaNome, canvas.width / 2, yOffset);
              yOffset += 25;
            }
          } catch (error) {
            console.warn('Erro ao carregar logo, continuando sem logo:', error);
          }
        }

        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(tipo === 'exercicio' ? 'Exercício' : 'Treino', canvas.width / 2, yOffset);
        yOffset += 20;

        ctx.font = '12px Arial';
        ctx.fillStyle = textColor;
        const lines = nomeItem.match(/.{1,30}/g) || [nomeItem];
        lines.forEach((line) => {
          ctx.fillText(line, canvas.width / 2, yOffset);
          yOffset += 15;
        });

        yOffset += 10;
        
        const qrSize = size;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = yOffset;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode-${academiaNome ? academiaNome.replace(/\s+/g, '-') : tipo}-${nomeItem.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            URL.revokeObjectURL(svgUrl);
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Erro ao fazer download do QR code:', error);
    }
  };

  const imprimirQRCode = () => {
    if (!qrCodeRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isDarkMode = document.documentElement.classList.contains('dark');
    const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
    const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';
    const cardBackground = isDarkMode ? '#1e293b' : '#ffffff';
    const borderColor = isDarkMode ? '#334155' : '#e2e8f0';

    const container = qrCodeRef.current.cloneNode(true) as HTMLElement;
    const style = `
      <style>
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: ${backgroundColor};
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        body {
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: ${backgroundColor};
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .qr-container {
          text-align: center;
          background: ${cardBackground};
          padding: 20px;
          border-radius: 12px;
          border: 1px solid ${borderColor};
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .qr-container h3,
        .qr-container p {
          color: ${textColor} !important;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        svg {
          max-width: 100%;
          height: auto;
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${nomeItem}</title>
          ${style}
        </head>
        <body>
          <div class="qr-container">${container.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrCodeRef}
        className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-red-600 to-red-700 rounded-lg border border-red-500 shadow-lg"
      >
        {academiaLogoUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/30 bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <NextImage
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
          <div className="flex items-center justify-center bg-white/20 p-2 rounded-lg">
            <Logo width={120} height={40} />
          </div>
        )}
        {academiaNome && (
          <h3 className="text-lg font-semibold text-white text-center">
            {academiaNome}
          </h3>
        )}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCodeSVG value={url} size={size} level="M" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white mb-1">
            {tipo === 'exercicio' ? 'Exercício' : 'Treino'}
          </p>
          <p className="text-xs text-white/90 max-w-[250px] break-words">
            {nomeItem}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={downloadQRCode}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={imprimirQRCode}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </div>
    </div>
  );
}
