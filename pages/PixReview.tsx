import React, { useState } from 'react';
import { TransferTarget } from '../types';

interface PixReviewProps {
  target: TransferTarget | null;
  amount: string;
  onConfirm: () => void;
}

const PixReview: React.FC<PixReviewProps> = ({ target, amount, onConfirm }) => {
  const [repeatPayment, setRepeatPayment] = useState(false);
  const [saveContact, setSaveContact] = useState(false);

  // Fallback data
  const displayTarget = target || {
    name: 'Genilson Ferreira Dos Santos',
  };

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
                 <span className="text-[15px] font-bold text-gray-900">Hoje, 15 de Dez</span>
                 <button className="text-santander-red text-[13px] font-bold underline decoration-1 underline-offset-2">Agendar</button>
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
               <span className="text-[15px] font-bold text-gray-800">Escrever uma mensagem</span>
               <button className="text-santander-red text-[13px] font-bold underline decoration-1 underline-offset-2">Adicionar</button>
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
           className="w-full bg-santander-red text-white font-medium text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors"
         >
           Confirmar e transferir
         </button>
      </div>
    </div>
  );
};

export default PixReview;