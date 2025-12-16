import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { User, Transaction } from '../types';

interface ExtractProps {
  user: User;
  transactions: Transaction[];
  onTransactionClick: (t: Transaction) => void;
}

const Extract: React.FC<ExtractProps> = ({ user, transactions, onTransactionClick }) => {
  // Initial state false to match screenshot (hidden balance)
  const [showBalance, setShowBalance] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Helper to format currency: -R$ 13,99
  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absValue = Math.abs(amount);
    const formattedString = absValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return isNegative ? `-R$ ${formattedString}` : `R$ ${formattedString}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API delay
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  // Format time for "Última atualização"
  const formattedTime = lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Sort dates descending (Newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Date formatter
  const formatDateHeader = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "Hoje.";
    if (dateStr === '2025-12-09') return "Hoje."; // Keeping legacy hardcoded check if needed

    const date = new Date(dateStr + 'T12:00:00'); 
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    return `${weekday}, ${day} de ${month}`;
  };

  return (
    <div className="pb-24 bg-white min-h-screen font-sans">
      
      {/* Saldo Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="text-gray-900 text-[17px] font-normal mb-1">Saldo disponível</div>
        
        <div className="flex justify-between items-center h-[42px] mb-2">
          <div className="flex items-center">
            <span className="text-[28px] font-bold text-gray-900 mr-3">R$</span>
            
            {/* Logic: If refreshing OR privacy mode is active (showBalance false), show the BLACK bar */}
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

      {/* Lançamentos Futuros */}
      <div className="bg-[#DCEBF2] px-4 py-3.5 flex justify-between items-center border-b border-gray-200">
         <div className="flex items-center space-x-3 text-gray-900">
            <Icons.Receipt size={22} strokeWidth={1.5} />
            <span className="text-[16px] font-normal">Lançamentos futuros</span>
         </div>
         <Icons.ChevronDown size={24} className="text-gray-600 stroke-1" />
      </div>

      {/* Transactions List */}
      <div>
        {sortedDates.map((date) => (
          <div key={date}>
            {/* Date Header */}
            <div className="bg-[#F4F4F4] px-4 py-3 flex items-center space-x-3 border-b border-gray-200/50">
              <Icons.Receipt size={22} className="text-gray-600 stroke-1.5" />
              <span className="text-[16px] text-gray-900 lowercase first-letter:capitalize font-normal">
                {formatDateHeader(date)}
              </span>
            </div>

            {/* Transactions for this date */}
            <div>
              {groupedTransactions[date].map((t) => {
                const isPositive = t.amount >= 0;
                // Colors based on screenshot
                const dotColor = isPositive ? 'bg-[#87CEEB]' : 'bg-[#EA8F34]';
                
                // Split description if it contains newline
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