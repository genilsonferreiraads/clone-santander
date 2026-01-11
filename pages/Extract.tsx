import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { User, Transaction } from '../types';

interface ExtractProps {
  user: User;
  transactions: Transaction[];
  onTransactionClick: (t: Transaction) => void;
}

const Extract: React.FC<ExtractProps> = ({ user, transactions, onTransactionClick }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absValue = Math.abs(amount);
    const formattedString = absValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return isNegative ? `-R$ ${formattedString}` : `R$ ${formattedString}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const formattedTime = lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Group transactions by date (only the YYYY-MM-DD part)
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    // Ensure we only get the YYYY-MM-DD part even if it's an ISO string
    const dateKey = transaction.date.split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDateHeader = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) return "Hoje.";

    // Split components to avoid timezone shifts
    const [year, month, day] = dateStr.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return "Data desconhecida";

    const date = new Date(year, month - 1, day);
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
    
    // Capitalize first letter of weekday
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).split('-')[0];
    
    return `${capitalizedWeekday}, ${day} de ${monthName}`;
  };

  return (
    <div className="pb-24 bg-white min-h-screen font-sans">
      <div className="p-5 border-b border-gray-100">
        <div className="text-gray-900 text-[17px] font-normal mb-1">Saldo disponível</div>
        
        <div className="flex justify-between items-center h-[42px] mb-2">
          <div className="flex items-center">
            <span className="text-[28px] font-bold text-gray-900 mr-3">R$</span>
            {isRefreshing || !showBalance ? (
               <div className="h-2.5 w-44 bg-[#333333] rounded-full mt-2"></div>
            ) : (
               <span className="text-[28px] font-bold text-gray-900">
                 {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </span>
            )}
          </div>
          
          <button 
            onClick={() => setShowBalance(!showBalance)} 
            className="text-santander-red p-1"
          >
            {showBalance ? <Icons.Eye size={24} /> : <Icons.EyeOff size={24} />}
          </button>
        </div>
        
        <div className="flex flex-col">
           <button className="text-santander-red text-[15px] font-medium underline decoration-1 underline-offset-4 w-fit">
             Entenda seu limite
           </button>
        </div>

        <div className="flex justify-between items-center mt-6">
           <span className="text-[13px] text-gray-500">Última atualização às {formattedTime}</span>
           <button 
             onClick={handleRefresh}
             disabled={isRefreshing}
             className="flex items-center space-x-1.5 text-santander-red font-medium disabled:opacity-70"
           >
             <Icons.ArrowRightLeft 
               size={18} 
               className={isRefreshing ? "animate-spin" : ""} 
               strokeWidth={2.5}
             /> 
             <span className="text-[15px]">Atualizar</span>
           </button>
        </div>
      </div>

      <div className="bg-[#DCEBF2] px-4 py-3.5 flex justify-between items-center border-b border-gray-200">
         <div className="flex items-center space-x-3 text-gray-900">
            <Icons.Receipt size={22} strokeWidth={1.5} />
            <span className="text-[16px] font-normal">Lançamentos futuros</span>
         </div>
         <Icons.ChevronDown size={24} className="text-gray-600 stroke-1" />
      </div>

      <div>
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="bg-[#F4F4F4] px-4 py-3 flex items-center space-x-3 border-b border-gray-200/50">
              <Icons.Receipt size={22} className="text-gray-600 stroke-1.5" />
              <span className="text-[16px] text-gray-900 font-normal">
                {formatDateHeader(date)}
              </span>
            </div>

            <div>
              {groupedTransactions[date].map((t) => {
                const isPositive = t.amount >= 0;
                const dotColor = isPositive ? 'bg-[#87CEEB]' : 'bg-[#EA8F34]';
                const parts = t.description.split('\n');
                const title = parts[0];
                const subtitle = parts.length > 1 ? parts[1] : '';

                return (
                  <div 
                    key={t.id} 
                    onClick={() => onTransactionClick(t)}
                    className="pl-4 py-4 pr-4 bg-white border-b border-gray-100 relative cursor-pointer active:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="mt-2 mr-4">
                        <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                      </div>
                      <div className="flex-1">
                          <div className="text-[16px] text-gray-800 font-normal">{title}</div>
                          <div className="flex justify-between items-end mt-1">
                            <div className="text-[14px] text-gray-400 truncate max-w-[200px] leading-tight">
                              {subtitle}
                            </div>
                            <div className="flex items-center">
                              <span className={`text-[15px] font-bold text-gray-900 mr-2 whitespace-nowrap`}>
                                {formatCurrency(t.amount)}
                              </span>
                              <Icons.ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extract;