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

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20; // Left/Right margin
      let y = 20; // Vertical cursor

      // --- PDF CONTENT GENERATION (Matching PixReceiptDetail) ---

      // 1. Header (Santander Logo/Text)
      doc.setTextColor(236, 0, 0); // Santander Red
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      // Simple text representation of logo
      doc.text("Santander", pageWidth / 2, y, { align: 'center' });
      y += 10;

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

      // Bottom Watermark
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("Comprovante gerado pelo App Santander", margin, 280);

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