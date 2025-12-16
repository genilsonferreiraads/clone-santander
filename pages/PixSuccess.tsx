import React, { useState } from 'react';
import { TransferTarget, User } from '../types';
import { Icons } from '../components/Icons';
import { jsPDF } from 'jspdf';

interface PixSuccessProps {
  target: TransferTarget | null;
  amount: string;
  onShowReceipt: () => void;
  onNewPix: () => void;
  user: User;
}

const SANTANDER_LOGO_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" id="Santander" x="0px" y="0px" viewBox="0 0 238.2 41.5" xml:space="preserve" width="238.2" height="41.5" xmlns="http://www.w3.org/2000/svg">
<style type="text/css">.st0{fill:#EC0000;}</style>
<g id="g8" transform="translate(0,-0.4)">
<path class="st0" d="M 31.5,19.5 C 31.4,18 31,16.5 30.2,15.2 L 23.4,3.3 C 22.9,2.4 22.5,1.4 22.3,0.4 L 22,0.9 c -1.7,2.9 -1.7,6.6 0,9.5 l 5.5,9.5 c 1.7,2.9 1.7,6.6 0,9.5 l -0.3,0.5 c -0.2,-1 -0.6,-2 -1.1,-2.9 l -5,-8.7 -3.2,-5.6 C 17.4,11.8 17,10.8 16.8,9.8 l -0.3,0.5 c -1.7,2.9 -1.7,6.5 0,9.5 v 0 l 5.5,9.5 c 1.7,2.9 1.7,6.6 0,9.5 l -0.3,0.5 c -0.2,-1 -0.6,-2 -1.1,-2.9 L 13.7,24.5 C 12.8,22.9 12.4,21.1 12.4,19.3 5.1,21.2 0,25.3 0,30 0,36.6 9.8,41.9 21.9,41.9 34,41.9 43.8,36.6 43.8,30 43.9,25.5 38.9,21.4 31.5,19.5 Z m 20.7,20.3 c 0.1,-1.7 0.3,-2.8 0.8,-4.2 2.3,1.1 5.3,1.6 7.5,1.6 3.8,0 6,-1.2 6,-3.7 0,-2.4 -1.6,-3.5 -5.4,-5.2 L 59,27.5 c -3.9,-1.7 -6.5,-3.9 -6.5,-8.2 0,-4.7 3.3,-7.7 9.9,-7.7 2.7,0 5.2,0.4 7.5,1.2 -0.1,1.6 -0.4,2.9 -0.8,4.1 -2.2,-0.8 -4.9,-1.2 -6.8,-1.2 -3.6,0 -5.2,1.4 -5.2,3.6 0,2.1 1.6,3.4 4.5,4.6 l 2.2,0.9 c 5.2,2.2 7.4,4.6 7.4,8.6 0,4.7 -3.6,8 -10.6,8 -3.3,0 -6.1,-0.5 -8.4,-1.6 z M 93.3,20.1 v 20.6 h -4.2 l -0.2,-2.5 c -1.2,1.8 -2.9,3 -5.8,3 -5.4,0 -9.1,-4 -9.1,-10.9 0,-7.2 3.9,-11.4 11.5,-11.4 3,0.1 5.5,0.4 7.8,1.2 z M 88.8,36 V 23.1 c -0.9,-0.2 -2,-0.2 -3.3,-0.2 -4.7,0 -6.9,2.9 -6.9,7.5 0,4.2 1.7,7.2 5.7,7.2 1.9,-0.1 3.3,-0.7 4.5,-1.6 z m 27.7,-9.1 V 40.7 H 112 v -13 c 0,-3.3 -1.1,-4.8 -5.6,-4.8 -1.1,0 -2.3,0.1 -3.6,0.3 V 40.7 H 98.3 V 20.1 c 2.9,-0.7 6.1,-1.2 8.2,-1.2 7.6,0.1 10,3 10,8 z m 12.6,10.5 c 1.3,0 2.6,-0.2 3.5,-0.6 -0.1,1.2 -0.3,2.6 -0.5,3.8 -1.2,0.5 -2.6,0.7 -3.8,0.7 -4.4,0 -7.2,-2 -7.2,-7 V 12.6 c 1.4,-0.5 3.1,-0.7 4.5,-0.7 v 7.8 h 7.2 c -0.1,1.4 -0.2,2.7 -0.4,3.9 h -6.8 v 10.1 c 0,2.6 1.3,3.7 3.5,3.7 z m 24.3,-17.3 v 20.6 h -4.2 L 149,38.2 c -1.2,1.8 -2.9,3 -5.8,3 -5.4,0 -9.1,-4 -9.1,-10.9 0,-7.2 3.9,-11.4 11.5,-11.4 3,0.1 5.4,0.4 7.8,1.2 z M 148.8,36 V 23.1 c -0.9,-0.2 -2,-0.2 -3.3,-0.2 -4.7,0 -6.9,2.9 -6.9,7.5 0,4.2 1.7,7.2 5.7,7.2 1.9,-0.1 3.4,-0.7 4.5,-1.6 z m 27.8,-9.1 V 40.7 H 172 v -13 c 0,-3.3 -1.1,-4.8 -5.6,-4.8 -1.1,0 -2.3,0.1 -3.6,0.3 v 17.5 h -4.5 V 20.1 c 2.9,-0.7 6.1,-1.2 8.2,-1.2 7.6,0.1 10.1,3 10.1,8 z m 22.9,-15 v 28.8 h -4.2 l -0.2,-2.6 c -1.2,1.9 -2.9,3.1 -5.9,3.1 -5.4,0 -9.1,-4 -9.1,-10.9 0,-7.2 3.9,-11.4 11.5,-11.4 1.2,0 2.3,0.1 3.4,0.3 v -6.8 c 1.4,-0.4 3,-0.5 4.5,-0.5 z M 195,36 V 23.3 c -1.2,-0.2 -2.4,-0.4 -3.6,-0.4 -4.5,0 -6.6,2.8 -6.6,7.5 0,4.2 1.7,7.2 5.7,7.2 1.8,-0.1 3.3,-0.7 4.5,-1.6 z m 27.3,-4.1 h -14.5 c 0.6,3.7 2.7,5.4 6.8,5.4 2.5,0 5,-0.5 7.2,-1.6 -0.2,1.2 -0.4,2.8 -0.7,4.1 -2.1,0.9 -4.2,1.3 -6.7,1.3 -7.6,0 -11.2,-4.2 -11.2,-11.2 0,-6.1 2.8,-11 10,-11 6.5,0 9.3,4.2 9.3,9.4 0,1.4 0,2.4 -0.2,3.6 z M 207.8,28.1 H 218 c 0,-3.4 -1.8,-5.4 -4.9,-5.4 -3.3,0.1 -5,1.9 -5.3,5.4 z m 30.4,-8.9 c 0,1.4 -0.2,3 -0.4,3.9 -1.1,-0.1 -2.1,-0.2 -3.4,-0.2 -1.1,0 -2.2,0.1 -3.3,0.2 v 17.6 h -4.5 V 20.1 c 1.9,-0.7 5.2,-1.2 7.7,-1.2 1.3,0.1 2.9,0.1 3.9,0.3 z" id="path6" />
</g>
</svg>`;

const PixSuccess: React.FC<PixSuccessProps> = ({ target, amount, onShowReceipt, onNewPix, user }) => {
  const [isSharing, setIsSharing] = useState(false);

  const displayTarget = target || {
    name: 'Genilson Ferreira dos Santos',
    cpf: '***.438.494-**',
    bank: 'NU PAGAMENTOS - IP'
  };

  // Generate date/time once on mount
  const [transactionData] = useState(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');
    
    // Generate a dynamic ID based on date: E + random + YYYYMMDD + random
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
    const transactionId = `E90400888${yyyy}${mm}${dd}${randomSuffix}`;

    return {
      fullDateTime: `${dateStr} - ${timeStr}`,
      transactionId
    };
  });

  const generateLogoDataUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Combine XML declaration with SVG data
      const svgBlob = new Blob([SANTANDER_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set scale for high quality PDF render
        const scale = 4; 
        canvas.width = 238.2 * scale;
        canvas.height = 41.5 * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error("Could not get canvas context"));
        }
        URL.revokeObjectURL(url);
      };
      
      img.onerror = (e) => {
        reject(e);
        URL.revokeObjectURL(url);
      }

      img.src = url;
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20; // Left/Right margin
      
      // Vertical alignment calculation:
      // A4 is 297mm high. 
      // Estimated content height is approx 210-220mm.
      // Starting at 40mm places the content block roughly in the center vertically.
      let y = 40; 

      // --- PDF CONTENT GENERATION (Matching PixReceiptDetail) ---

      // 1. Header (Santander SVG Logo)
      try {
        const logoData = await generateLogoDataUrl();
        // Aspect ratio 238.2 / 41.5 = ~5.74
        // Let's set width to 45mm, calculate height
        const logoWidth = 45;
        const logoHeight = logoWidth / 5.74;
        const logoX = (pageWidth - logoWidth) / 2;
        
        doc.addImage(logoData, 'PNG', logoX, y, logoWidth, logoHeight);
        y += logoHeight + 10;
      } catch (e) {
        console.error("Failed to render logo", e);
        // Fallback
        doc.setTextColor(236, 0, 0); 
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("Santander", pageWidth / 2, y + 5, { align: 'center' });
        y += 15;
      }

      // 2. Title
      doc.setTextColor(0, 0, 0); // Black
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text("Comprovante do Pix", pageWidth / 2, y, { align: 'center' });
      y += 6;

      // 3. Date Subtitle
      doc.setTextColor(156, 163, 175); // Gray-500 approx
      doc.setFontSize(10);
      doc.text(transactionData.fullDateTime, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Helper function for Data Groups
      const drawLabel = (text: string, currentY: number) => {
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray
        doc.setFont('helvetica', 'normal');
        doc.text(text, margin, currentY);
        return currentY + 5;
      };

      const drawValue = (text: string, currentY: number, isBold = false) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.text(text, margin, currentY);
        return currentY + 8; // Spacing after value
      };

      const drawLine = (currentY: number) => {
        doc.setDrawColor(229, 231, 235); // Light Gray
        doc.line(margin, currentY, pageWidth - margin, currentY);
        return currentY + 8;
      };

      // 4. Valor Pago
      y = drawLabel("Valor pago", y);
      y = drawValue(`R$ ${amount}`, y);
      y = drawLine(y);

      // 5. Forma de pagamento
      y = drawLabel("Forma de pagamento", y);
      y = drawValue("Ag 4037 Cc 1019649-0", y);
      y += 4; // Extra space

      // 6. Dados do Recebedor
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text("Dados do recebedor", margin, y);
      y += 6;

      // Nested details for receiver
      y = drawLabel("Para", y);
      y = drawValue(displayTarget.name, y);
      
      y = drawLabel("CPF", y);
      y = drawValue(displayTarget.cpf, y);

      y = drawLabel("Chave", y);
      y = drawValue("***.438.494-**", y);

      y = drawLabel("Instituição", y);
      y = drawValue(displayTarget.bank || '', y);
      y += 4; // Extra space

      // 7. Dados do Pagador
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text("Dados do pagador", margin, y);
      y += 6;

      // Nested details for payer
      y = drawLabel("De", y);
      y = drawValue(user.name, y);

      y = drawLabel("CPF", y);
      y = drawValue("***.438.494-**", y); // Matching hardcoded logic or user prop if available

      y = drawLabel("Instituição", y);
      y = drawValue("BCO SANTANDER (BRASIL) S.A.", y);
      
      // Divider
      y += 2;
      // y = drawLine(y); // Optional: The screenshot in Detail view usually doesn't have a full divider here, just spacing
      y += 4;

      // 8. Footer Info
      y = drawLabel("ID/Transação", y);
      // Handle potential long ID wrapping
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const splitId = doc.splitTextToSize(transactionData.transactionId, pageWidth - (margin * 2));
      doc.text(splitId, margin, y);
      y += (splitId.length * 6) + 4;

      y = drawLabel("Data e hora da transação", y);
      y = drawValue(transactionData.fullDateTime, y);

      // Bottom Watermark - Fixed at the bottom of the page
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("Comprovante gerado pelo App Santander", margin, pageHeight - 15);

      // --- END PDF CONTENT ---

      // Generate Blob
      const pdfBlob = doc.output('blob');
      
      // Create File object
      const file = new File([pdfBlob], `comprovante_pix_${transactionData.transactionId}.pdf`, { type: 'application/pdf' });

      // Share via Native Share Sheet
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Comprovante Pix Santander',
          text: `Segue o comprovante da transação no valor de R$ ${amount}.`
        });
      } else {
        // Fallback for browsers that don't support file sharing -> Download
        doc.save(`comprovante_pix_${transactionData.transactionId}.pdf`);
      }

    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans flex flex-col p-4 relative">
      
      {/* Success Card */}
      <div className="border border-gray-300 rounded-lg p-4 flex items-center space-x-4 mb-8">
         <div className="w-8 h-8 rounded-full bg-[#7DB655] flex items-center justify-center shrink-0">
             <Icons.Check className="text-white" size={20} strokeWidth={3} />
         </div>
         <span className="text-[15px] text-gray-800 leading-tight">
             Pronto! Seu pagamento foi realizado.
         </span>
      </div>

      <div className="mb-6">
         <h3 className="font-bold text-[16px] text-gray-900 mb-1">Comprovante do Pix</h3>
         <p className="text-[15px] text-gray-800 leading-snug">
           Você pode consultar o comprovante da sua transação em Início &gt; Pix &gt; Extrato Pix.
         </p>
      </div>

      <div className="space-y-5">
         <div>
            <p className="text-[13px] text-gray-500 mb-0.5">Valor pago</p>
            <p className="text-[17px] font-bold text-gray-900">R$ {amount}</p>
         </div>

         <div>
            <p className="text-[13px] text-gray-500 mb-0.5">Para</p>
            <p className="text-[15px] text-gray-800">{displayTarget.name}</p>
         </div>

         <div>
            <p className="text-[13px] text-gray-500 mb-0.5">CPF</p>
            <p className="text-[15px] text-gray-800">{displayTarget.cpf}</p>
         </div>

         <div>
            <p className="text-[13px] text-gray-500 mb-0.5">Instituição</p>
            <p className="text-[15px] text-gray-800">{displayTarget.bank}</p>
         </div>

         <div className="border-t border-gray-200 pt-4">
             <p className="text-[13px] text-gray-500 mb-0.5">ID/Transação</p>
             <p className="text-[15px] text-gray-800 font-normal">{transactionData.transactionId}</p>
         </div>

         <div>
             <p className="text-[13px] text-gray-500 mb-0.5">Data e hora da transação</p>
             <p className="text-[15px] text-gray-800">{transactionData.fullDateTime}</p>
         </div>

         <div>
             <p className="text-[13px] text-gray-500 mb-0.5">Código de autenticação</p>
             <p className="text-[15px] text-gray-900 font-bold">9B059BF27256AF607715088</p>
         </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 pb-8 space-y-4">
          <button 
             onClick={handleShare}
             disabled={isSharing}
             className="w-full bg-santander-red text-white font-medium text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors flex justify-center items-center"
          >
             {isSharing ? (
               <>
                 <Icons.ArrowRightLeft className="animate-spin mr-2" size={20} />
                 Gerando PDF...
               </>
             ) : (
               "Salvar ou Compartilhar"
             )}
          </button>

          <button 
             onClick={onNewPix}
             className="w-full bg-white border border-santander-red text-santander-red font-medium text-[16px] py-3 rounded hover:bg-red-50 transition-colors"
          >
             Fazer novo Pix
          </button>

          <button 
             onClick={onShowReceipt}
             className="w-full text-santander-red font-medium text-[15px] underline decoration-1 underline-offset-2"
          >
             Ver comprovante completo
          </button>
      </div>

    </div>
  );
};

export default PixSuccess;