export const CARD_WIDTH_MM = 53.98;
export const CARD_HEIGHT_MM = 85.6;

export async function generateQRCodeImageData(
  url: string,
  academiaLogoUrl: string | null | undefined,
  academiaNome: string | undefined,
  tipo: 'exercicio' | 'treino',
  nomeItem: string,
  size: number = 200,
  isDarkMode: boolean = false
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const { QRCodeSVG } = await import('qrcode.react');
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível criar canvas'));
        return;
      }

      const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
      const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';

      const padding = 30;
      const logoHeight = academiaLogoUrl ? 80 : 0;
      const logoBottomSpacing = academiaLogoUrl ? 20 : 0;
      const academiaNomeHeight = (academiaNome && logoHeight > 0) ? 20 : 0;
      const academiaNomeSpacing = (academiaNome && logoHeight > 0) ? 10 : 0;
      const typeHeight = 20;
      const typeSpacing = 15;
      const qrPadding = 15;
      const qrBottomSpacing = 25;
      const nameLineHeight = 20;
      
      const qrSize = size;
      
      ctx.font = 'bold 18px Arial';
      const maxWidth = qrSize + padding;
      const words = nomeItem.split(' ');
      const nameLines: string[] = [];
      let currentLine = '';
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          nameLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) {
        nameLines.push(currentLine);
      }
      
      const nameHeight = nameLines.length * nameLineHeight;
      
      const canvasWidth = qrSize + padding * 2;
      const canvasHeight = padding + 
        logoHeight + 
        logoBottomSpacing + 
        academiaNomeHeight + 
        academiaNomeSpacing +
        typeHeight + 
        typeSpacing + 
        qrSize + 
        qrPadding * 2 + 
        qrBottomSpacing + 
        nameHeight + 
        padding;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = `${size}px`;
      tempDiv.style.height = `${size}px`;
      document.body.appendChild(tempDiv);

      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        React.createElement(QRCodeSVG, {
          value: url,
          size: size,
          level: 'M',
        })
      );

      setTimeout(() => {
        const svgElement = tempDiv.querySelector('svg');
        if (!svgElement) {
          document.body.removeChild(tempDiv);
          root.unmount();
          reject(new Error('QR Code não foi gerado'));
          return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = document.createElement('img');
        
        img.onload = async () => {
          try {
            let yOffset = padding;

            if (academiaLogoUrl) {
              try {
                const logoImg = document.createElement('img');
                logoImg.crossOrigin = 'anonymous';
                
                await new Promise<void>((resolve, reject) => {
                  logoImg.onload = () => resolve();
                  logoImg.onerror = reject;
                  logoImg.src = academiaLogoUrl!;
                });

                const logoSize = 80;
                const logoX = (canvas.width - logoSize) / 2;
                const logoY = yOffset;
                const borderRadius = 12;
                
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(logoX + borderRadius, logoY);
                ctx.lineTo(logoX + logoSize - borderRadius, logoY);
                ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + borderRadius);
                ctx.lineTo(logoX + logoSize, logoY + logoSize - borderRadius);
                ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - borderRadius, logoY + logoSize);
                ctx.lineTo(logoX + borderRadius, logoY + logoSize);
                ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - borderRadius);
                ctx.lineTo(logoX, logoY + borderRadius);
                ctx.quadraticCurveTo(logoX, logoY, logoX + borderRadius, logoY);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                ctx.restore();
                
                yOffset += logoSize + logoBottomSpacing;

                if (academiaNome) {
                  ctx.fillStyle = textColor;
                  ctx.font = 'bold 16px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(academiaNome, canvas.width / 2, yOffset);
                  yOffset += academiaNomeHeight + academiaNomeSpacing;
                }
              } catch (error) {
                console.warn('Erro ao carregar logo, continuando sem logo:', error);
              }
            }

            ctx.fillStyle = textColor;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(tipo === 'exercicio' ? 'Exercício' : 'Treino', canvas.width / 2, yOffset);
            yOffset += typeHeight + typeSpacing;
            
            const qrPadding = 15;
            const qrX = (canvas.width - qrSize) / 2;
            const qrY = yOffset;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(qrX - qrPadding, qrY - qrPadding, qrSize + qrPadding * 2, qrSize + qrPadding * 2);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            
            yOffset = qrY + qrSize + qrPadding + qrBottomSpacing;

            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            nameLines.forEach((line) => {
              ctx.fillText(line, canvas.width / 2, yOffset);
              yOffset += nameLineHeight;
            });

            const dataUrl = canvas.toDataURL('image/png');
            document.body.removeChild(tempDiv);
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            resolve(dataUrl);
          } catch (error) {
            document.body.removeChild(tempDiv);
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            reject(error);
          }
        };

        img.onerror = () => {
          document.body.removeChild(tempDiv);
          URL.revokeObjectURL(svgUrl);
          root.unmount();
          reject(new Error('Erro ao carregar imagem do QR code'));
        };

        img.src = svgUrl;
      }, 200);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera imagem do card no formato vertical 53.98mm x 85.6mm (cartão de crédito em pé).
 * Ordem: logo, QR code, label EXERCÍCIO/TREINO, nome do item (quebra de linha, sem ellipsis).
 */
export async function generateQRCodeCardImageData(
  url: string,
  academiaLogoUrl: string | null | undefined,
  _academiaNome: string | undefined,
  tipo: 'exercicio' | 'treino',
  nomeItem: string,
  isDarkMode: boolean = false
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const { QRCodeSVG } = await import('qrcode.react');
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');

      const scale = 10;
      const canvasWidth = Math.round(CARD_WIDTH_MM * scale);
      const canvasHeight = Math.round(CARD_HEIGHT_MM * scale);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível criar canvas'));
        return;
      }

      const backgroundColor = isDarkMode ? '#1e293b' : '#dc2626';
      const textColor = isDarkMode ? '#f1f5f9' : '#ffffff';
      const padding = 26;
      const logoSize = 160;
      const qrSize = 300;
      const cardRadius = 24;
      const qrPadding = 6;
      const qrRadius = 16;
      const gapLogoToQR = 36;
      const gapQRToType = 80;
      const gapTypeToName = 8;
      const lineHeightLabel = 36;
      const lineHeightName = 32;
      const typeLabel = tipo === 'exercicio' ? 'EXERCÍCIO' : 'TREINO';

      ctx.font = '28px Arial';
      const maxTextWidth = canvasWidth - padding * 2;
      const words = nomeItem.split(' ');
      const nameLines: string[] = [];
      let currentLine = '';
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine) {
          nameLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) nameLines.push(currentLine);

      const roundRectPath = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
      };

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      roundRectPath(0, 0, canvasWidth, canvasHeight, cardRadius);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      roundRectPath(0, 0, canvasWidth, canvasHeight, cardRadius);
      ctx.clip();

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = `${qrSize}px`;
      tempDiv.style.height = `${qrSize}px`;
      document.body.appendChild(tempDiv);

      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        React.createElement(QRCodeSVG, {
          value: url,
          size: qrSize,
          level: 'M',
        })
      );

      setTimeout(() => {
        const svgElement = tempDiv.querySelector('svg');
        if (!svgElement) {
          document.body.removeChild(tempDiv);
          root.unmount();
          reject(new Error('QR Code não foi gerado'));
          return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = document.createElement('img');

        img.onload = async () => {
          try {
            let y = padding;

            if (academiaLogoUrl) {
              try {
                const logoImg = document.createElement('img');
                logoImg.crossOrigin = 'anonymous';
                await new Promise<void>((res, rej) => {
                  logoImg.onload = () => res();
                  logoImg.onerror = rej;
                  logoImg.src = academiaLogoUrl!;
                });
                const logoX = (canvasWidth - logoSize) / 2;
                const logoRadius = Math.min(24, logoSize * 0.15);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(logoX + logoRadius, y);
                ctx.lineTo(logoX + logoSize - logoRadius, y);
                ctx.quadraticCurveTo(logoX + logoSize, y, logoX + logoSize, y + logoRadius);
                ctx.lineTo(logoX + logoSize, y + logoSize - logoRadius);
                ctx.quadraticCurveTo(logoX + logoSize, y + logoSize, logoX + logoSize - logoRadius, y + logoSize);
                ctx.lineTo(logoX + logoRadius, y + logoSize);
                ctx.quadraticCurveTo(logoX, y + logoSize, logoX, y + logoSize - logoRadius);
                ctx.lineTo(logoX, y + logoRadius);
                ctx.quadraticCurveTo(logoX, y, logoX + logoRadius, y);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(logoImg, logoX, y, logoSize, logoSize);
                ctx.restore();
                y += logoSize + gapLogoToQR;
              } catch {
                //
              }
            } else {
              ctx.fillStyle = textColor;
              ctx.font = 'bold 40px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('GymNFC', canvasWidth / 2, y + logoSize / 2);
              y += logoSize + gapLogoToQR;
            }

            const qrX = (canvasWidth - qrSize) / 2;
            const qrBoxY = y - qrPadding;
            const qrBoxW = qrSize + qrPadding * 2;
            const qrBoxH = qrSize + qrPadding * 2;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(qrX - qrPadding + qrRadius, qrBoxY);
            ctx.lineTo(qrX - qrPadding + qrBoxW - qrRadius, qrBoxY);
            ctx.quadraticCurveTo(qrX - qrPadding + qrBoxW, qrBoxY, qrX - qrPadding + qrBoxW, qrBoxY + qrRadius);
            ctx.lineTo(qrX - qrPadding + qrBoxW, qrBoxY + qrBoxH - qrRadius);
            ctx.quadraticCurveTo(qrX - qrPadding + qrBoxW, qrBoxY + qrBoxH, qrX - qrPadding + qrBoxW - qrRadius, qrBoxY + qrBoxH);
            ctx.lineTo(qrX - qrPadding + qrRadius, qrBoxY + qrBoxH);
            ctx.quadraticCurveTo(qrX - qrPadding, qrBoxY + qrBoxH, qrX - qrPadding, qrBoxY + qrBoxH - qrRadius);
            ctx.lineTo(qrX - qrPadding, qrBoxY + qrRadius);
            ctx.quadraticCurveTo(qrX - qrPadding, qrBoxY, qrX - qrPadding + qrRadius, qrBoxY);
            ctx.closePath();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.clip();
            ctx.drawImage(img, qrX, y, qrSize, qrSize);
            ctx.restore();
            y += qrSize + gapQRToType;

            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = isDarkMode ? '#94a3b8' : 'rgba(255,255,255,0.9)';
            ctx.textAlign = 'center';
            ctx.fillText(typeLabel, canvasWidth / 2, y);
            y += lineHeightLabel + gapTypeToName;

            ctx.font = '32px Arial';
            ctx.fillStyle = textColor;
            nameLines.forEach((line) => {
              ctx.fillText(line, canvasWidth / 2, y);
              y += lineHeightName;
            });

            ctx.restore();

            const dataUrl = canvas.toDataURL('image/png');
            document.body.removeChild(tempDiv);
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            resolve(dataUrl);
          } catch (error) {
            document.body.removeChild(tempDiv);
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            reject(error);
          }
        };

        img.onerror = () => {
          document.body.removeChild(tempDiv);
          URL.revokeObjectURL(svgUrl);
          root.unmount();
          reject(new Error('Erro ao carregar imagem do QR code'));
        };

        img.src = svgUrl;
      }, 200);
    } catch (error) {
      reject(error);
    }
  });
}
