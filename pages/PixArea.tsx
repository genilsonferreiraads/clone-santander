
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { TransferTarget } from '../types';

interface PixAreaProps {
  onNavigateToAmount: (target: TransferTarget) => void;
}

const PixArea: React.FC<PixAreaProps> = ({ onNavigateToAmount }) => {
  const [inputValue, setInputValue] = useState('');

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

  const recentContacts = [
    { initials: 'GS', name: 'Genilso...', type: 'CPF', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'Nu Pagamentos  Ip' } },
    { initials: 'HS', name: 'Higina C.', type: 'Aleatória', fullData: { name: 'Higina Carolina Gomes', cpf: '***.123.456-**', bank: 'BANCO DO BRASIL' } },
    { initials: 'EP', name: 'Edilania F.', type: 'Celular', fullData: { name: 'Edilania Ferreira', cpf: '***.987.654-**', bank: 'CAIXA ECONOMICA' } },
    { initials: 'TS', name: 'Tarcisio R.', type: 'Aleatória', fullData: { name: 'Tarcisio Rodrigues', cpf: '***.555.444-**', bank: 'BRADESCO' } },
    { initials: 'MP', name: 'M E.', type: 'CNPJ', fullData: { name: 'M E. LTDA', cpf: '**.***.***/0001-**', bank: 'SANTANDER' } },
    { initials: 'GS', name: 'Genilso...', type: 'E-mail', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'Nu Pagamentos  Ip' } },
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans pb-10">
      
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
           {/* Card 1 */}
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.Building2 size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Agência<br/>e conta</span>
           </div>
           {/* Card 2 */}
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.FileText size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Pix copia<br/>e cola</span>
           </div>
           {/* Card 3 */}
           <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center border border-gray-50 aspect-square">
              <Icons.QrCode size={24} className="text-santander-red mb-3" />
              <span className="text-[13px] text-gray-700 leading-tight">Código<br/>QR</span>
           </div>
        </div>
      </div>

      {/* Outras transferências Section */}
      <div className="px-5">
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

    </div>
  );
};

export default PixArea;
