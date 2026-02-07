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
