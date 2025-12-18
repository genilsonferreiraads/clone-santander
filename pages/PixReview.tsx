import React, { useState } from 'react';
import { TransferTarget } from '../types';
import { Icons } from '../components/Icons';

interface PixReviewProps {
  target: TransferTarget | null;
  amount: string;
  onConfirm: () => void;
}

const PixReview: React.FC<PixReviewProps> = ({ target, amount, onConfirm }) => {
  const [repeatPayment, setRepeatPayment] = useState(false);
  const [saveContact, setSaveContact] = useState(false);
  
  // States for the new screens
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  
  // Date State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pixMessage, setPixMessage] = useState('');
  const [tempMessage, setTempMessage] = useState('');

  // Calendar Logic
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
    
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    
    if (isToday) return `Hoje, ${day} de ${monthName}`;
    
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `${capitalizedWeekday}, ${day} de ${monthName}`;
  };

  // Fallback data
  const displayTarget = target || {
    name: 'Genilson Ferreira Dos Santos',
  };

  if (isCalendarOpen) {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans">
        <div className="p-6 pt-safe flex justify-between items-center">
          <h2 className="text-[24px] font-medium text-gray-900">Quando você quer pagar?</h2>
          <button onClick={() => setIsCalendarOpen(false)}>
            <Icons.X size={28} className="text-gray-800" strokeWidth={1} />
          </button>
        </div>
        
        <div className="px-6 mb-8">
          <p className="text-[17px] text-gray-800">Selecione uma data para agendar o seu pagamento.</p>
        </div>

        <div className="px-6 flex-1">
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <button onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}>
                  <Icons.ChevronRight className="rotate-180 text-gray-900" size={20} />
                </button>
                <span className="text-[17px] font-medium text-santander-red border-b border-santander-red pb-0.5">
                  {months[currentMonth]}
                </span>
                <button onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}>
                  <Icons.ChevronRight className="text-gray-900" size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={() => setCurrentYear(prev => prev - 1)}>
                  <Icons.ChevronRight className="rotate-180 text-gray-900" size={20} />
                </button>
                <span className="text-[17px] font-medium text-santander-red border-b border-santander-red pb-0.5">
                  {currentYear}
                </span>
                <button onClick={() => setCurrentYear(prev => prev + 1)}>
                   <Icons.ChevronRight className="bg-gray-100 rounded-md text-gray-400 p-0.5" size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-4">
              {weekDays.map(day => (
                <span key={day} className="text-[15px] text-gray-500 font-normal py-2">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center gap-y-2">
              {days.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`}></div>;
                
                const isSelected = selectedDate.getDate() === day && 
                                  selectedDate.getMonth() === currentMonth && 
                                  selectedDate.getFullYear() === currentYear;

                return (
                  <button 
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`h-10 w-10 flex items-center justify-center text-[15px] mx-auto rounded-full transition-colors ${
                      isSelected ? 'bg-santander-red text-white font-bold' : 'text-gray-400 font-normal'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 pb-12">
           <button 
             onClick={() => setIsCalendarOpen(false)}
             className="w-full bg-santander-red text-white font-bold text-[17px] py-4 rounded-lg shadow-md"
           >
             Salvar data
           </button>
        </div>
      </div>
    );
  }

  if (isMessageOpen) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans">
        <div className="p-6 pt-safe flex justify-between items-center">
          <h2 className="text-[24px] font-medium text-gray-900">Mensagem</h2>
          <button onClick={() => setIsMessageOpen(false)}>
            <Icons.X size={28} className="text-gray-800" strokeWidth={1} />
          </button>
        </div>
        
        <div className="px-6 mb-6">
          <p className="text-[17px] text-gray-800">Você pode escrever aqui uma mensagem para quem vai receber o Pix.</p>
        </div>

        <div className="px-6 flex-1">
          <div className="relative">
            <textarea 
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              placeholder="Mensagem"
              className="w-full h-48 border border-gray-400 rounded-lg p-4 text-[17px] text-gray-900 outline-none focus:border-santander-red resize-none"
            />
            {!tempMessage && (
               <span className="absolute top-4 left-4 text-gray-400 text-[17px] pointer-events-none">Mensagem</span>
            )}
          </div>
        </div>

        <div className="p-6 pb-12">
           <button 
             onClick={() => {
               setPixMessage(tempMessage);
               setIsMessageOpen(false);
             }}
             className="w-full bg-santander-red text-white font-bold text-[17px] py-4 rounded-lg shadow-md"
           >
             Salvar mensagem
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans flex flex-col">
      <div className="p-5 pt-6 flex-1">
        
        <h2 className="text-[20px] font-normal text-gray-900 leading-tight mb-1">
          Confirmar pagamento para
        </h2>
        <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-8">
          {displayTarget.name}
        </h2>

        {/* Details List */}
        <div className="space-y-6">
           {/* Valor */}
           <div className="border-b border-gray-100 pb-4">
              <p className="text-[13px] text-gray-500 mb-1">Valor</p>
              <div className="flex justify-between items-center">
                 <span className="text-[17px] font-bold text-gray-900">R$ {amount}</span>
                 <button className="text-santander-red text-[13px] font-bold underline decoration-1 underline-offset-2">Alterar</button>
              </div>
           </div>

           {/* Quando */}
           <div className="border-b border-gray-100 pb-4">
              <p className="text-[13px] text-gray-500 mb-1">Quando vai ser feito</p>
              <div className="flex justify-between items-center">
                 <span className="text-[15px] font-bold text-gray-900">
                    {formatDateLabel(selectedDate)}
                 </span>
                 <button 
                  onClick={() => setIsCalendarOpen(true)}
                  className="text-santander-red text-[13px] font-bold underline decoration-1 underline-offset-2"
                 >
                   Agendar
                 </button>
              </div>
           </div>

           {/* Repetir */}
           <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
              <span className="text-[15px] font-bold text-gray-800">Repetir pagamento</span>
              <button 
                onClick={() => setRepeatPayment(!repeatPayment)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${repeatPayment ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${repeatPayment ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
           </div>

           {/* Tipo */}
           <div className="border-b border-gray-100 pb-4">
               <p className="text-[13px] text-gray-500 mb-1">Tipo de pagamento</p>
               <span className="text-[15px] font-bold text-gray-900">Pix</span>
           </div>

            {/* Forma de pagamento */}
           <div className="border-b border-gray-100 pb-4">
               <p className="text-[13px] text-gray-500 mb-1">Forma de pagamento</p>
               <div className="flex justify-between items-center">
                   <span className="text-[15px] font-bold text-gray-900">Saldo em conta</span>
                   <button className="text-gray-400 text-[13px] underline decoration-1 underline-offset-2">Alterar</button>
               </div>
           </div>
           
           {/* Mensagem */}
            <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
               <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-gray-800">Escrever uma mensagem</span>
                  {pixMessage && <span className="text-[13px] text-gray-500 italic truncate max-w-[200px]">{pixMessage}</span>}
               </div>
               <button 
                onClick={() => {
                  setTempMessage(pixMessage);
                  setIsMessageOpen(true);
                }}
                className="text-santander-red text-[13px] font-bold underline decoration-1 underline-offset-2"
               >
                 {pixMessage ? 'Editar' : 'Adicionar'}
               </button>
           </div>

            {/* Salvar Contato */}
           <div className="pb-4 flex justify-between items-center">
              <span className="text-[15px] text-gray-500 font-bold">Salvar contato</span>
               <button 
                onClick={() => setSaveContact(!saveContact)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${saveContact ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${saveContact ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
           </div>
        </div>

      </div>

      <div className="p-4 pb-8 mt-auto">
         <button 
           onClick={onConfirm}
           className="w-full bg-santander-red text-white font-medium text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors shadow-md"
         >
           Confirmar e transferir
         </button>
      </div>
    </div>
  );
};

export default PixReview;