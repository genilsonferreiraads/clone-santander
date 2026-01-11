import React from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';

interface PixPaymentMethodProps {
  onContinue: () => void;
  user: User;
}

const PixPaymentMethod: React.FC<PixPaymentMethodProps> = ({ onContinue, user }) => {
  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans flex flex-col">
      <div className="p-4 pt-6 flex-1">
        <h2 className="text-[22px] font-normal text-gray-900 mb-6 tracking-tight">
          Como você quer pagar?
        </h2>

        <h3 className="text-[15px] font-normal text-gray-900 mb-4">
          Principais formas de pagamento
        </h3>

        {/* Account Balance Option Card */}
        <div className="border border-gray-300 rounded-lg p-4 flex items-start space-x-3 shadow-sm cursor-pointer relative">
            <div className="mt-1 text-santander-red">
               <Icons.SantanderLogo size={24} />
            </div>
            
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900 text-[15px]">Saldo em conta</span>
                    {/* Selected Radio Button */}
                    <div className="w-5 h-5 rounded-full border-[6px] border-santander-red bg-white"></div>
                </div>
                
                <div className="text-[13px] text-gray-800 mb-1">
                   Conta corrente 01019649-0
                </div>
                <div className="text-[13px] text-gray-800 mb-1">
                   Saldo: R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[13px] text-gray-800">
                   Saldo + Limite: R$ {user.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            </div>
        </div>

      </div>

      <div className="p-4 pb-8 mt-auto">
         <button 
           onClick={onContinue}
           className="w-full bg-santander-red text-white font-medium text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors"
         >
           Continuar
         </button>
      </div>
    </div>
  );
};

export default PixPaymentMethod;