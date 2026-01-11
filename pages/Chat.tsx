import React from 'react';
import { Icons } from '../components/Icons';

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-white relative">
      
      {/* Info Banner */}
      <div className="bg-white p-4 flex items-start space-x-3 border-b border-gray-200 shadow-sm z-10">
         <div className="text-santander-red mt-0.5">
           <Icons.MessageSquare size={20} className="rotate-180" /> {/* Simulate info icon */}
         </div>
         <p className="text-sm text-gray-700 leading-snug">
           Você chegou ao início da conversa. Não há mensagens anteriores
         </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
         
         <div className="flex justify-center mb-6">
            <span className="bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-600 font-medium shadow-sm">
              Hoje
            </span>
         </div>

         {/* Messages */}
         <div className="space-y-4">
            
            <div className="bg-gray-100 rounded-lg rounded-tl-none p-4 max-w-[90%] relative">
               <p className="text-gray-900 text-sm font-medium">
                 Olá, <span className="font-bold">Genilson!</span> Eu sou o Assistente Virtual 24h do Santander.
               </p>
               <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">19:00</span>
            </div>

             <div className="bg-gray-100 rounded-lg rounded-tl-none p-4 max-w-[90%] relative">
               <p className="text-gray-900 text-sm">
                 <span className="font-bold">Milhões de clientes</span> já estão por aqui, aproveitando um atendimento <span className="font-bold">ágil e seguro.</span>
               </p>
               <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">19:00</span>
            </div>

             <div className="bg-gray-100 rounded-lg rounded-tl-none p-4 max-w-[90%] relative">
               <p className="text-gray-900 text-sm">
                 É só <span className="font-bold">escolher</span> uma opção.
               </p>
               <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">19:00</span>
            </div>

            {/* Options Pills */}
            <div className="flex flex-wrap justify-end gap-2 pr-4 pl-12">
               <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white">
                 Cartões
               </button>
               <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white">
                 Minha conta
               </button>
               <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white">
                 Empréstimos
               </button>
               <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white">
                 Renegociar dívidas
               </button>
                <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white">
                 Capitalização Din Din
               </button>
                <button className="border border-santander-red text-santander-red rounded-full px-4 py-2 text-sm font-medium bg-white ml-auto">
                 Mais opções
               </button>
            </div>

         </div>

      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3 mb-[60px]">
         <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3">
           <input 
             type="text" 
             placeholder="Digite sua mensagem" 
             className="bg-transparent w-full outline-none text-gray-600 placeholder-gray-400"
           />
         </div>
         <button className="text-santander-red">
           <Icons.Send size={28} />
         </button>
      </div>

    </div>
  );
};

export default Chat;