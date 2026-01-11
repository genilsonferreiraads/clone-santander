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
  const parts = transaction.description.split('\n');
  
  let typeLabel = parts[0]; 
  if (transaction.type === 'pix_received') {
    typeLabel = 'Pix recebido';
  } else if (transaction.type === 'pix_sent') {
    typeLabel = 'Pix enviado';
  }

  const name = transaction.target?.name || (parts.length > 1 ? parts[1] : 'Desconhecido');
  const bankName = transaction.target?.bank || 'Instituição Financeira';

  // Robust parsing for Transaction Detail
  const dateObj = new Date(transaction.date);
  let dateTimeString = "Data indisponível";
  
  if (!isNaN(dateObj.getTime())) {
    const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const capitalWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).split('-')[0];
    dateTimeString = `${capitalWeekday}, ${formattedDate} às ${time}`;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       <header className="bg-santander-red text-white p-4 pt-safe flex items-center shadow-md relative z-30 h-16 shrink-0">
        <button onClick={onBack} className="p-1 mr-4">
          <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Detalhe do lançamento</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto no-scrollbar">
         <div className="mb-6">
            <p className="text-gray-500 text-[15px] mb-2 font-normal">{typeLabel}</p>
            <p className="text-[17px] text-gray-900 mb-1">
               {isPositive ? 'De' : 'Para'} <span className="font-bold">{name}</span>
            </p>
            <h1 className={`text-[36px] font-bold mb-1 tracking-tight ${isPositive ? 'text-[#75B63E]' : 'text-gray-900'}`}>
               {isPositive ? '' : '-'}R$ {absAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h1>
            <p className="text-gray-500 text-[15px] mb-6 font-normal">
              {bankName}
            </p>
            <div className="h-[1px] bg-gray-200 w-full mb-6"></div>
         </div>

         <div className="space-y-6">
            <div>
               <p className="text-gray-500 text-[15px] mb-1 font-normal">Data e horário</p>
               <p className="text-[20px] text-gray-800 font-normal">
                 {dateTimeString}
               </p>
            </div>

            <div>
               <p className="text-gray-500 text-[15px] mb-1 font-normal">Saldo em conta após este lançamento</p>
               <p className="text-[20px] text-gray-800 font-normal">
                 R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </p>
            </div>
         </div>
      </div>

      {transaction.type === 'pix_sent' && (
        <div className="p-4 pb-8 mt-auto">
            <button 
            onClick={onOpenReceipt}
            className="w-full bg-santander-red text-white font-bold text-[16px] py-3.5 rounded hover:bg-santander-darkRed transition-colors"
            >
            Acessar comprovante
            </button>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;