import React, { useState } from 'react';
import { TransferTarget } from '../types';

interface PixAmountProps {
  target: TransferTarget | null;
  onContinue: (amount: string) => void;
}

const PixAmount: React.FC<PixAmountProps> = ({ target, onContinue }) => {
  const [amount, setAmount] = useState('0,00');

  // Fallback data if accessed directly without target (shouldn't happen in normal flow)
  const displayTarget = target || {
    name: 'Genilson Ferreira dos Santos',
    cpf: '***.438.494-**',
    bank: 'NU PAGAMENTOS - IP',
    key: '***.438.494-**'
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    // Convert to number and back to string to remove leading zeros appropriately
    const numberValue = parseInt(value, 10);
    
    if (isNaN(numberValue)) {
       setAmount("0,00");
       return;
    }

    // Pad with zeros if length is small
    const paddedValue = numberValue.toString().padStart(3, "0");
    
    // Insert comma
    const integerPart = paddedValue.slice(0, -2);
    const decimalPart = paddedValue.slice(-2);
    
    // Format integer part with thousands separator if needed
    const formattedInteger = parseInt(integerPart, 10).toLocaleString('pt-BR');
    
    setAmount(`${formattedInteger},${decimalPart}`);
  };

  const isButtonEnabled = amount !== '0,00';

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans flex flex-col">
      
      <div className="p-4 pt-6 flex-1">
        <h2 className="text-[22px] font-normal text-gray-900 mb-6">
          Quanto você vai enviar ?
        </h2>

        <div className="mb-8">
           <p className="text-[15px] text-gray-900 mb-1">
             Para <span className="font-bold">{displayTarget.name}</span>
           </p>
           <p className="text-[13px] text-gray-600 mb-1">
             CPF: {displayTarget.cpf} - {displayTarget.bank || 'Banco Desconhecido'}
           </p>
           <p className="text-[13px] text-gray-600">
             Chave: {displayTarget.key || displayTarget.cpf}
           </p>
        </div>

        <div className="mb-2">
          <label className="text-[13px] text-gray-800">Valor</label>
        </div>
        
        <div className="relative mb-6">
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">R$</span>
           <input 
             type="text" 
             value={amount}
             onChange={handleAmountChange}
             inputMode="numeric"
             className="w-full border border-gray-400 rounded h-12 pl-10 pr-3 text-xl font-bold text-gray-600 outline-none focus:border-santander-red focus:text-gray-900 transition-colors"
             autoFocus
           />
        </div>
      </div>

      <div className="p-4 pb-8 mt-auto">
         <button 
           onClick={() => onContinue(amount)}
           className={`w-full font-medium text-[16px] py-3 rounded transition-colors ${
             isButtonEnabled 
             ? 'bg-santander-red text-white hover:bg-santander-darkRed' 
             : 'bg-[#CCCCCC] text-white cursor-default'
           }`}
           disabled={!isButtonEnabled}
         >
           Continuar
         </button>
      </div>

    </div>
  );
};

export default PixAmount;