import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { TransferTarget } from '../types';

interface PixAreaProps {
  onNavigateToAmount: (target: TransferTarget) => void;
}

const PixArea: React.FC<PixAreaProps> = ({ onNavigateToAmount }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatInput = (value: string) => {
    // 1. Handle non-numeric keys (Email, Random Key)
    if (/[a-zA-Z@]/.test(value)) return value;

    const rawValue = value.replace(/\D/g, '');

    // 2. Distinguish between Phone, CPF and CNPJ based on length and 3rd digit heuristic
    
    // CNPJ Mask: 00.000.000/0000-00 (14 digits)
    // We switch to CNPJ mode once the 12th digit is entered
    if (rawValue.length > 11) {
      return rawValue
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    }

    // Heuristic for 11-digit keys (Phone vs CPF):
    // If the 3rd digit is '9', it's almost certainly a mobile phone (Area Code + 9 + Number)
    // If it starts with '(', it's definitely a phone number
    const looksLikePhone = value.startsWith('(') || (rawValue.length >= 3 && rawValue[2] === '9');

    if (looksLikePhone) {
        // Phone Mask: (00) 00000-0000
        return rawValue
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 15);
    } else {
        // CPF Mask: 000.000.000-00
        return rawValue
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .substring(0, 14);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInput(e.target.value);
    setInputValue(formatted);
  };

  const clearInput = () => setInputValue('');

  const recentContacts = [
    { initials: 'KC', name: 'Kaua E.', type: 'Celular', fullData: { name: 'Kaua Eduardo', cpf: '***.111.222-**', bank: 'NUBANK' } },
    { initials: 'JS', name: 'Jose H.', type: 'CPF', fullData: { name: 'Jose Henrique', cpf: '***.222.333-**', bank: 'ITAU' } },
    { initials: 'GS', name: 'Genilso...', type: 'CPF', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'NU PAGAMENTOS - IP' } },
    { initials: 'EP', name: 'Edilania F.', type: 'Celular', fullData: { name: 'Edilania Ferreira', cpf: '***.987.654-**', bank: 'CAIXA ECONOMICA' } },
    { initials: 'HS', name: 'Higina C.', type: 'Aleatória', fullData: { name: 'Higina Carolina Gomes', cpf: '***.123.456-**', bank: 'BANCO DO BRASIL' } },
    { initials: 'TS', name: 'Tarcisio R.', type: 'Aleatória', fullData: { name: 'Tarcisio Rodrigues', cpf: '***.555.444-**', bank: 'BRADESCO' } },
  ];

  const handleContinue = () => {
    if (inputValue.length < 3) return;
    setIsLoading(true);
    
    setTimeout(() => {
        setIsLoading(false);
        const savedPayee = localStorage.getItem('santander_clone_settings_payee');
        let mockTarget: TransferTarget;

        if (savedPayee) {
            const parsedPayee = JSON.parse(savedPayee);
            mockTarget = {
                name: parsedPayee.name || 'Recebedor Configurado',
                bank: parsedPayee.bank || 'SANTANDER',
                key: inputValue,
                cpf: '***.***.***-**'
            };
        } else {
             mockTarget = {
                name: 'Genilson Ferreira Dos',
                cpf: '***.438.494-**',
                bank: 'Nu Pagamentos  Ip',
                key: inputValue
            };
        }
        onNavigateToAmount(mockTarget);
    }, 800);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans relative">
      
      <div className="p-4 pt-6">
        <h2 className="text-[26px] font-medium text-gray-800 mb-8 leading-tight">
          Para quem você vai transferir?
        </h2>

        {/* Search/Input Field Container */}
        <div className="relative mb-2">
            {/* Field Label on Border Effect */}
            <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
               <span className="text-[13px] text-gray-500 font-normal">Nome, Chave ou Pix copia e cola</span>
            </div>
            
            <div className="relative group">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 rounded-lg p-4 pt-5 pb-3 text-[19px] text-gray-900 placeholder-transparent outline-none focus:border-[#4BBCCF] focus:ring-0 transition-all font-normal"
                    autoComplete="off"
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    {inputValue.length > 0 && (
                        <button onClick={clearInput} className="p-1 text-gray-400">
                           <Icons.X size={24} strokeWidth={1.5} />
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div className="text-[15px] text-gray-600 mb-10 px-1">
           Celular, CPF/CNPJ, e-mail, chave-aleatória...
        </div>

        {/* Transfira Novamente Section */}
        <div className="mb-8">
           <h3 className="text-[20px] text-gray-400 font-normal mb-6">Transfira novamente</h3>
           
           <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {recentContacts.map((contact, index) => (
                 <button 
                  key={index} 
                  className="flex flex-col items-center shrink-0 w-[78px]"
                  onClick={() => onNavigateToAmount(contact.fullData)}
                 >
                    <div className="w-[64px] h-[64px] rounded-full bg-[#DCEBF2] text-[#84B7C6] flex items-center justify-center text-[19px] font-medium mb-3">
                       {contact.initials}
                    </div>
                    <span className="text-[14px] text-gray-500 truncate w-full text-center leading-tight mb-0.5">{contact.name}</span>
                    <span className="text-[11px] text-gray-400 truncate w-full text-center">{contact.type}</span>
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* Continuar Button - Fixed at bottom of screen area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm pb-8 z-40">
          <button 
            onClick={handleContinue}
            disabled={inputValue.length === 0 || isLoading}
            className={`w-full font-bold text-[18px] py-4 rounded-lg transition-all shadow-md flex justify-center items-center ${
                inputValue.length > 0 
                ? 'bg-[#EC0000] text-white active:bg-[#CC0000]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
             {isLoading ? <Icons.ArrowRightLeft className="animate-spin" size={24}/> : "Continuar"}
          </button>
      </div>

    </div>
  );
};

export default PixArea;