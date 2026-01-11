import React, { useState } from 'react';
import { TransferTarget, User } from '../types';
import { Icons } from '../components/Icons';

interface PixReceiptDetailProps {
  target: TransferTarget | null;
  amount: string;
  onClose: () => void;
  user: User;
}

const PixReceiptDetail: React.FC<PixReceiptDetailProps> = ({ target, amount, onClose, user }) => {
  const displayTarget = target || {
    name: 'Genilson Ferreira dos Santos',
    cpf: '***.438.494-**',
    bank: 'NU PAGAMENTOS - IP'
  };

  // Generate date/time once on mount to simulate the receipt time
  const [transactionData] = useState(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');
    
    // Generate a dynamic ID based on date: E + random + YYYYMMDD + random
    // Note: In a real app this would be passed via props to match PixSuccess exactly,
    // but for this clone, generating a fresh one close to the previous one is acceptable.
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

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col items-center pt-8 px-8 relative z-50">
      
      {/* Close button for the overlay */}
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 p-2">
         <Icons.X size={24} />
      </button>

      {/* Header Logo */}
      <div className="flex items-center space-x-2 text-santander-red mb-4">
         <Icons.SantanderLogo size={24} />
         <span className="font-bold text-xl tracking-tight">Santander</span>
      </div>

      <h1 className="text-[18px] text-black font-normal mb-1 text-center">
        Comprovante do Pix
      </h1>
      <p className="text-[12px] text-gray-500 mb-8 text-center">
        {transactionData.fullDateTime}
      </p>

      <div className="w-full max-w-md space-y-6">
         
         <div className="border-b border-gray-300 pb-2">
            <p className="text-[11px] text-gray-500 mb-0.5">Valor pago</p>
            <p className="text-[14px] text-black font-normal">R$ {amount}</p>
         </div>

         <div className="mb-4">
             <p className="text-[11px] text-gray-500 mb-0.5">Forma de pagamento</p>
             <p className="text-[14px] text-black font-normal leading-tight">Ag 4037 Cc 1019649-0</p>
         </div>
        
         <div className="mb-4">
            <p className="text-[11px] text-gray-500 mb-2">Dados do recebedor</p>
            
            <div className="space-y-4">
                <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">Para</p>
                    <p className="text-[14px] text-black font-normal">{displayTarget.name}</p>
                </div>
                <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">CPF</p>
                    <p className="text-[14px] text-black font-normal">{displayTarget.cpf}</p>
                </div>
                 <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">Chave</p>
                    <p className="text-[14px] text-black font-normal">***.438.494-**</p>
                </div>
                 <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">Instituição</p>
                    <p className="text-[14px] text-black font-normal">{displayTarget.bank}</p>
                </div>
            </div>
         </div>

         <div className="mb-4">
            <p className="text-[11px] text-gray-500 mb-2">Dados do pagador</p>
            
            <div className="space-y-4">
                <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">De</p>
                    <p className="text-[14px] text-black font-normal">{user.name}</p>
                </div>
                <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">CPF</p>
                    <p className="text-[14px] text-black font-normal">***.438.494-**</p>
                </div>
                 <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">Instituição</p>
                    <p className="text-[14px] text-black font-normal">BCO SANTANDER (BRASIL) S.A.</p>
                </div>
            </div>
         </div>

         <div className="space-y-4 pt-2">
            <div>
                 <p className="text-[11px] text-gray-500 mb-0.5">ID/Transação</p>
                 <p className="text-[14px] text-black font-normal break-all">{transactionData.transactionId}</p>
            </div>
             <div>
                 <p className="text-[11px] text-gray-500 mb-0.5">Data e hora da transação</p>
                 <p className="text-[14px] text-black font-normal">{transactionData.fullDateTime}</p>
            </div>
         </div>

      </div>

      <div className="w-full max-w-md mt-auto mb-8 text-right">
          <span className="text-[10px] text-gray-500">1/2</span>
      </div>

    </div>
  );
};

export default PixReceiptDetail;