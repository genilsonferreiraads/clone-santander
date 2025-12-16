import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { TransferTarget } from '../types';

interface PixAreaProps {
  onNavigateToAmount: (target: TransferTarget) => void;
}

const PixArea: React.FC<PixAreaProps> = ({ onNavigateToAmount }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recentContacts = [
    { initials: 'GS', name: 'Genilso...', type: 'CPF', fullData: { name: 'Genilson Ferreira Dos Santos', cpf: '***.438.494-**', bank: 'NU PAGAMENTOS - IP' } },
    { initials: 'HS', name: 'Higina C.', type: 'Aleatória', fullData: { name: 'Higina Carolina Gomes', cpf: '***.123.456-**', bank: 'BANCO DO BRASIL' } },
    { initials: 'EP', name: 'Edilania F.', type: 'Celular', fullData: { name: 'Edilania Ferreira', cpf: '***.987.654-**', bank: 'CAIXA ECONOMICA' } },
    { initials: 'TS', name: 'Tarcisio R.', type: 'Aleatória', fullData: { name: 'Tarcisio Rodrigues', cpf: '***.555.444-**', bank: 'BRADESCO' } },
    { initials: 'MP', name: 'M E.', type: 'CNPJ', fullData: { name: 'Mercado E. LTDA', cpf: '**.***.***/***1-**', bank: 'ITAU' } },
    { initials: 'GS', name: 'Genilso...', type: 'E-mail', fullData: { name: 'Genilson Ferreira', cpf: '***.438.494-**', bank: 'SANTANDER' } },
  ];

  // Simulator for Pix Key Lookup
  const handleContinue = () => {
    if (inputValue.length < 3) return; // Simple validation

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        
        let mockTarget: TransferTarget;

        // CHECK LOCALSTORAGE FOR SETTINGS
        const savedPayee = localStorage.getItem('santander_clone_settings_payee');
        
        if (savedPayee) {
            const parsedPayee = JSON.parse(savedPayee);
            mockTarget = {
                name: parsedPayee.name || 'Recebedor Configurado',
                bank: parsedPayee.bank || 'SANTANDER',
                key: inputValue,
                cpf: '***.***.***-**' // Masked default
            };
        } else {
            // FALLBACK TO RANDOM MOCK DATA IF NO SETTINGS
             mockTarget = {
                name: 'Recebedor Desconhecido',
                cpf: '***.***.***-**',
                bank: 'Instituição Desconhecida',
                key: inputValue
            };

            if (inputValue.includes('@')) {
                mockTarget.name = "Loja de Conveniência LTDA";
                mockTarget.cpf = "**.123.456/0001-**";
                mockTarget.bank = "INTER";
            } else if (inputValue.replace(/\D/g, '').length === 11) {
                 // Simulate CPF
                 mockTarget.name = "Maria Oliveira Santos";
                 mockTarget.cpf = "***." + inputValue.slice(3,6) + "." + inputValue.slice(6,9) + "-**";
                 mockTarget.bank = "BANCO DO BRASIL";
            } else if (inputValue.replace(/\D/g, '').length > 11) {
                 // Simulate CNPJ or Random Key
                 mockTarget.name = "Comercial Exemplo S.A.";
                 mockTarget.cpf = "**.***.***/0001-**";
                 mockTarget.bank = "ITAU UNIBANCO";
            } else {
                 // Random key fallback
                 mockTarget.name = "João da Silva";
                 mockTarget.cpf = "***.111.222-**";
                 mockTarget.bank = "NUBANK";
            }
        }

        onNavigateToAmount(mockTarget);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleContinue();
    }
  }

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] font-sans">
      
      <div className="p-4 pt-6">
        <h2 className="text-[22px] font-normal text-gray-900 mb-6 tracking-tight">
          Para quem você vai transferir?
        </h2>

        {/* Search/Input Field */}
        <div className="relative mb-2">
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nome, Chave ou Pix copia e cola"
                className="w-full border border-gray-400 rounded p-4 text-[17px] text-gray-900 placeholder-gray-600 outline-none focus:border-santander-red focus:ring-1 focus:ring-santander-red transition-all"
            />
            {inputValue.length > 0 && (
                <button 
                    onClick={handleContinue}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-santander-red"
                >
                    {isLoading ? <Icons.ArrowRightLeft className="animate-spin" size={24}/> : <Icons.ChevronRight size={28} />}
                </button>
            )}
        </div>
        <div className="text-[13px] text-gray-600 mb-8">
           Celular, CPF/CNPJ, e-mail, chave-aleatória...
        </div>

        {/* Carousel Container */}
        <div className="bg-[#EAF5F8] -mx-4 px-4 py-6 mb-8">
           <h3 className="text-[17px] text-gray-800 font-normal mb-4">Transfira novamente</h3>
           
           <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {recentContacts.map((contact, index) => (
                 <button 
                  key={index} 
                  className="flex flex-col items-center shrink-0 w-[72px]"
                  onClick={() => onNavigateToAmount(contact.fullData)}
                 >
                    {/* Updated Color to match screenshot */}
                    <div className="w-[60px] h-[60px] rounded-full bg-[#84B7C6] text-white flex items-center justify-center text-xl font-medium mb-2 opacity-90">
                       {contact.initials}
                    </div>
                    <span className="text-[13px] text-gray-900 truncate w-full text-center leading-tight mb-0.5">{contact.name}</span>
                    <span className="text-[11px] text-gray-600 truncate w-full text-center">{contact.type}</span>
                 </button>
              ))}
           </div>

           <button className="flex items-center space-x-2 mt-4 text-santander-red font-medium">
             <Icons.Contact size={24} strokeWidth={1.5} />
             <span className="text-[15px]">Acessar todos os contatos</span>
           </button>
        </div>

        {/* Also Use Section */}
        <h3 className="text-[17px] text-gray-900 font-bold mb-4">Você também pode usar</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
            <button className="bg-white border border-gray-100 shadow-sm rounded-lg py-6 px-2 flex flex-col items-center h-32 justify-center active:bg-gray-50">
               <div className="text-santander-red mb-3">
                  <Icons.Building2 size={32} strokeWidth={1.5} />
               </div>
               <span className="text-[13px] text-gray-800 text-center leading-tight">Agência<br/>e conta</span>
            </button>

            <button className="bg-white border border-gray-100 shadow-sm rounded-lg py-6 px-2 flex flex-col items-center h-32 justify-center active:bg-gray-50">
               <div className="text-santander-red mb-3">
                  <Icons.Copy size={32} strokeWidth={1.5} />
               </div>
               <span className="text-[13px] text-gray-800 text-center leading-tight">Pix copia<br/>e cola</span>
            </button>

            <button className="bg-white border border-gray-100 shadow-sm rounded-lg py-6 px-2 flex flex-col items-center h-32 justify-center active:bg-gray-50">
               <div className="text-santander-red mb-3">
                  <Icons.QrCode size={32} strokeWidth={1.5} />
               </div>
               <span className="text-[13px] text-gray-800 text-center leading-tight">Código<br/>QR</span>
            </button>
        </div>

        {/* Other Transfers */}
        <h3 className="text-[17px] text-gray-900 font-bold mb-4">Outras transferências</h3>
        
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 flex items-center justify-between mb-20 active:bg-gray-50">
           <div className="flex items-center space-x-3">
              <div className="text-santander-red">
                 {/* New custom Bring Money Icon */}
                 <Icons.BringMoney size={24} />
              </div>
              <span className="text-[15px] font-bold text-gray-900">Trazer Dinheiro</span>
           </div>
           <span className="bg-[#5BC5D5] text-white text-[11px] font-bold px-2 py-1 rounded">Novo</span>
        </div>

      </div>
    </div>
  );
};

export default PixArea;