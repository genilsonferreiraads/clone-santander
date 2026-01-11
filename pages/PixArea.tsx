
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { TransferTarget } from '../types';

interface PixAreaProps {
  onNavigateToAmount: (target: TransferTarget) => void;
}

const PixArea: React.FC<PixAreaProps> = ({ onNavigateToAmount }) => {
  const [inputValue, setInputValue] = useState('');
  const [savedPayee, setSavedPayee] = useState<{name: string, bank: string, cpf?: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('santander_clone_settings_payee');
    if (saved) {
      try {
        setSavedPayee(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved payee settings", e);
      }
    }
  }, []);

  const formatInput = (value: string) => {
    if (/[a-zA-Z@]/.test(value)) return value;
    const rawValue = value.replace(/\D/g, '');
    if (rawValue.length > 11) {
      return rawValue
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    }
    const looksLikePhone = value.startsWith('(') || (rawValue.length >= 3 && rawValue[2] === '9');
    if (looksLikePhone) {
        return rawValue
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 15);
    } else {
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

  const handleContinue = () => {
    if (inputValue.trim()) {
      // Use saved settings if available, otherwise default hardcoded
      const name = savedPayee?.name && savedPayee.name.trim() !== '' 
        ? savedPayee.name 
        : 'Genilson Ferreira Dos Santos';
      
      const bank = savedPayee?.bank && savedPayee.bank.trim() !== '' 
        ? savedPayee.bank 
        : 'NU PAGAMENTOS - IP';

      const cpf = savedPayee?.cpf && savedPayee.cpf.trim() !== ''
        ? savedPayee.cpf
        : '***.438.494-**';

      onNavigateToAmount({
        name: name,
        cpf: cpf,
        bank: bank,
        key: inputValue
      });
    }
  };

  const recentContacts = [
    { initials: 'GS', name: 'Genilso...', type: 'CPF', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'Nu Pagamentos  Ip' } },
    { initials: 'HS', name: 'Higina C.', type: 'Aleatória', fullData: { name: 'Higina Carolina Gomes', cpf: '***.123.456-**', bank: 'BANCO DO BRASIL' } },
    { initials: 'EP', name: 'Edilania F.', type: 'Celular', fullData: { name: 'Edilania Ferreira', cpf: '***.987.654-**', bank: 'CAIXA ECONOMICA' } },
    { initials: 'TS', name: 'Tarcisio R.', type: 'Aleatória', fullData: { name: 'Tarcisio Rodrigues', cpf: '***.555.444-**', bank: 'BRADESCO' } },
    { initials: 'MP', name: 'M E.', type: 'CNPJ', fullData: { name: 'M E. LTDA', cpf: '**.***.***/0001-**', bank: 'SANTANDER' } },
    { initials: 'GS', name: 'Genilso...', type: 'E-mail', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'Nu Pagamentos  Ip' } },
  ];

  const hasInput = inputValue.length > 0;

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans pb-32 relative">
      
      {/* Title */}
      <div className="px-5 pt-10 pb-6">
        <h2 className="text-[26px] font-medium text-gray-800 leading-tight">
          Para quem você vai transferir?
        </h2>
      </div>

      {/* Input Field */}
      <div className="px-5 mb-8">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Nome, Chave ou Pix copia e cola"
            className="w-full border border-gray-400 rounded-lg p-4 text-[18px] text-gray-900 placeholder-gray-500 outline-none focus:border-gray-500"
          />
        </div>
        <p className="text-[14px] text-gray-500 mt-2 font-light">
          Celular, CPF/CNPJ, e-mail, chave-aleatória...
        </p>
      </div>

      {/* Transfira novamente Section */}
      <div className="bg-[#E9F4F8] pt-6 pb-4 mb-10">
        <div className="px-5">
           <h3 className="text-[19px] text-gray-800 font-normal mb-6">Transfira novamente</h3>
           
           <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-4">
              {recentContacts.map((contact, index) => (
                 <button 
                  key={index} 
                  className="flex flex-col items-center shrink-0 w-[72px]"
                  onClick={() => onNavigateToAmount(contact.fullData)}
                 >
                    <div className="w-[56px] h-[56px] rounded-full bg-[#AEC9D6] text-white flex items-center justify-center text-[20px] font-medium mb-2">
                       {contact.initials}
                    </div>
                    <span className="text-[13px] text-gray-800 truncate w-full text-center font-normal">{contact.name}</span>
                    <span className="text-[11px] text-gray-500 truncate w-full text-center">{contact.type}</span>
                 </button>
              ))}
           </div>

           <button className="flex items-center space-x-3 text-santander-red mt-2 py-2">
              <Icons.Contact size={26} strokeWidth={1.5} />
              <span className="text-[18px] font-normal">Acessar todos os contatos</span>
           </button>
        </div>
      </div>

      {/* Você também pode usar Section */}
      <div className="px-5 mb-12">
        <h3 className="text-[20px] text-gray-800 font-bold mb-6">Você também pode usar</h3>
        
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.Building2 size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Agência<br/>e conta</span>
           </div>
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.FileText size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Pix copia<br/>e cola</span>
           </div>
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.QrCode size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Código<br/>QR</span>
           </div>
        </div>
      </div>

      {/* Outras transferências Section */}
      <div className="px-5 mb-10">
         <h3 className="text-[20px] text-gray-800 font-bold mb-6">Outras transferências</h3>
         
         <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="text-santander-red">
                  <Icons.BringMoney size={28} />
               </div>
               <span className="text-[19px] font-bold text-gray-800">Trazer Dinheiro</span>
            </div>
            <span className="bg-[#4BBCCF] text-white text-[14px] font-bold px-3 py-1.5 rounded-md">
               Novo
            </span>
         </div>
      </div>

      {/* Floating Continue Button (Appears when user types) */}
      {hasInput && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 animate-in slide-in-from-bottom duration-300">
           <button 
             onClick={handleContinue}
             className="w-full bg-santander-red text-white font-bold text-[16px] py-4 rounded shadow-lg active:bg-santander-darkRed transition-colors"
           >
             Continuar
           </button>
        </div>
      )}

    </div>
  );
};

export default PixArea;
