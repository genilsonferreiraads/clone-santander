import React, { useState } from 'react';
import { TransferTarget } from '../types';
import { Icons } from '../components/Icons';
import { jsPDF } from 'jspdf';

interface PixSuccessProps {
  target: TransferTarget | null;
  amount: string;
  onShowReceipt: () => void;
  onNewPix: () => void;
}

const PixSuccess: React.FC<PixSuccessProps> = ({ target, amount, onShowReceipt, onNewPix }) => {
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

      // Header - Red Bar Simulation
      doc.setFillColor(236, 0, 0); // Santander Red
      doc.rect(0, 0, 210, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("Santander", 15, 13);

      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Comprovante de Pagamento Pix", 15, 40);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(transactionData.fullDateTime, 15, 46);

      // Details
      let y = 60;
      const lineHeight = 8;

      const addLine = (label: string, value: string, boldValue = false) => {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(label, 15, y);
        
        y += 5;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', boldValue ? 'bold' : 'normal');
        doc.setFontSize(12);
        doc.text(value, 15, y);
        
        y += lineHeight + 2;
      };

      addLine("Valor pago", `R$ ${amount}`, true);
      addLine("Para", displayTarget.name);
      addLine("CPF", displayTarget.cpf);
      addLine("Instituição", displayTarget.bank || '');
      
      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 10;

      addLine("ID/Transação", transactionData.transactionId);
      addLine("Data e Hora", transactionData.fullDateTime);
      addLine("Código de Autenticação", "9B059BF27256AF607715088", true);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("Comprovante gerado pelo App Santander", 15, 280);

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
           Você pode consultar o comprovante da sua transação em Início > Pix > Extrato Pix.
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