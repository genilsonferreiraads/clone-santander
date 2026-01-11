
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

  // Helper to format/mask the Pix Key
  const getMaskedKey = (targetItem: typeof displayTarget) => {
    const key = targetItem.key || targetItem.cpf || '';
    
    // 1. E-mail Masking: Xx*******xx@domain.com
    if (key.includes('@')) {
      const [user, domain] = key.split('@');
      if (user && user.length >= 4) {
        const firstTwo = user.substring(0, 2);
        const lastTwo = user.substring(user.length - 2);
        return `${firstTwo}*******${lastTwo}@${domain}`;
      }
      // Fallback for very short emails, simply return as is or apply generic mask
      return key; 
    }

    const clean = key.replace(/\D/g, '');

    // 2. Phone Masking: +55 (**) *****-NNNN
    // Check if it has parentheses (from PixArea formatting) or looks like a mobile number (11 digits, no dots)
    const isPhone = key.includes('(') || (clean.length === 11 && !key.includes('.'));
    
    if (isPhone && clean.length >= 4) {
      const lastFour = clean.slice(-4);
      return `+55 (**) *****-${lastFour}`;
    }

    // 3. CPF Masking: ***.XXX.XXX-**
    if (clean.length === 11) {
       const mid1 = clean.slice(3, 6);
       const mid2 = clean.slice(6, 9);
       return `***.${mid1}.${mid2}-**`;
    }

    // Return original if no specific format matched (or if already masked)
    return key;
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
             Chave: {getMaskedKey(displayTarget)}
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
