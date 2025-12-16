import React from 'react';
import { Icons } from '../components/Icons';
import { Transaction, User } from '../types';

interface TransactionDetailProps {
  transaction: Transaction | null;
  onBack: () => void;
  onOpenReceipt: () => void;
  user: User;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onBack, onOpenReceipt, user }) => {
  if (!transaction) return null;

  const isPositive = transaction.amount >= 0;
  const absAmount = Math.abs(transaction.amount);
  
  // Extract info from description (matches format in Extract: "Title\nSubtitle")
  const parts = transaction.description.split('\n');
  // Title (e.g. "Pix enviado")
  const typeLabel = parts[0]; 
  // Name (e.g. "Genilson Ferreira...")
  const name = transaction.target?.name || (parts.length > 1 ? parts[1] : 'Desconhecido');
  // Bank (e.g. "Nu Pagamentos Ip") - fallback to target bank or generic if not available
  const bankName = transaction.target?.bank || 'Instituição Financeira';

  // Format Date: "Segunda, 15/12/2025 às 21:03"
  const dateObj = new Date(transaction.date + 'T12:00:00');
  const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  
  // Mock time or use current if it's "today", otherwise random fixed time for "history" effect
  const time = "21:03"; // Hardcoded to match screenshot vibe or could be random
  const capitalWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).split('-')[0]; // Capitalize and remove "-feira" if preferred, or keep as is. Screenshot shows "Segunda"
  
  const dateTimeString = `${capitalWeekday}, ${formattedDate} às ${time}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       {/* Header */}
       <header className="bg-santander-red text-white p-4 pt-safe flex items-center shadow-md relative z-30">
        <button onClick={onBack} className="p-1 mr-4">
          <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Detalhe do lançamento</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col">
         
         {/* Top Section */}
         <div className="mb-6">
            <p className="text-gray-500 text-sm mb-1 font-normal">{typeLabel}</p>
            <p className="text-[17px] text-gray-900 mb-1">
               Para <span className="font-bold">{name}</span>
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 mb-1 tracking-tight">
               {isPositive ? '' : '-'}R$ {absAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h1>
            <p className="text-gray-500 text-sm mb-6 font-normal">
              {bankName}
            </p>
            
            {/* Divider */}
            <div className="h-[1px] bg-gray-200 w-full"></div>
         </div>

         {/* Details Section */}
         <div>
            <div className="mb-6">
               <p className="text-gray-500 text-[13px] mb-1 font-normal">Data e horário</p>
               <p className="text-[17px] text-gray-900 font-normal">
                 {dateTimeString}
               </p>
            </div>

            <div>
               <p className="text-gray-500 text-[13px] mb-1 font-normal">Saldo em conta após este lançamento</p>
               <p className="text-[17px] text-gray-900 font-normal">
                 R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </p>
            </div>
         </div>

      </div>

      {/* Footer Button - Only show receipt button for Pix transactions */}
      {transaction.type === 'pix_sent' && (
        <div className="p-4 pb-8 mt-auto">
            <button 
            onClick={onOpenReceipt}
            className="w-full bg-santander-red text-white font-bold text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors"
            >
            Acessar comprovante
            </button>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;