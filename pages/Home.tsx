import React from 'react';
import { Icons } from '../components/Icons';
import { QUICK_ACTIONS } from '../constants';
import { User } from '../types';

interface HomeProps {
  onNavigate: (tab: string) => void;
  user: User;
}

const Home: React.FC<HomeProps> = ({ onNavigate, user }) => {
  return (
    <div className="pb-24">
      
      {/* Quick Actions (Floating Circles) */}
      <div className="-mt-28 px-4 relative z-30">
        <div className="flex justify-between items-start space-x-2">
          {QUICK_ACTIONS.slice(0, 3).map((action) => {
            let Icon;
            switch(action.id) {
                case 'pix': Icon = Icons.Pix; break;
                case 'emprestimos': Icon = Icons.Loans; break;
                case 'dindin': Icon = Icons.DinDin; break;
                default: Icon = Icons.Barcode;
            }
            
            return (
              <button 
                key={action.id} 
                className="flex flex-col items-center w-20 group"
                onClick={() => action.id === 'pix' ? onNavigate('pix') : null}
              >
                <div className="w-14 h-14 rounded-full bg-white border border-santander-red shadow-md flex items-center justify-center mb-2 group-active:scale-95 transition-transform">
                  <Icon className="text-santander-red" size={28} />
                </div>
                <span className="text-xs text-center text-white font-medium">{action.label}</span>
              </button>
            )
          })}
          
           <button className="flex flex-col items-center w-20 group">
                <div className="w-14 h-14 rounded-full bg-white border border-santander-red shadow-md flex items-center justify-center mb-2 group-active:scale-95 transition-transform">
                  <Icons.MoreHorizontal className="text-santander-red" size={28} />
                </div>
                <span className="text-xs text-center text-white font-medium leading-tight">Mais ações rápidas</span>
            </button>
        </div>
      </div>

      <div className="px-4 mt-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Importante para você</h2>
        
        {/* Carousel */}
        <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar snap-x">
          <div className="snap-center shrink-0 w-[85%] bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-gray-600 mb-4 text-sm">
              Deixe seus boletos no débito automático e simplifique o dia a dia!
            </p>
            <button className="text-santander-red font-bold text-sm">
              Cadastre já
            </button>
          </div>
           <div className="snap-center shrink-0 w-[85%] bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-gray-600 mb-4 text-sm">
              Guarde R$50/Mês no DinDin e concorra a até 400 mil + prêmios na...
            </p>
            <button className="text-santander-red font-bold text-sm">
              Eu quero
            </button>
          </div>
           <div className="snap-center shrink-0 w-[85%] bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-gray-600 mb-4 text-sm">
              Ficou ainda mais fácil gerenciar seus cartões. A nova experiência está no ar.
            </p>
            <button className="text-santander-red font-bold text-sm">
              Confira aqui
            </button>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center space-x-1.5 mt-2">
           <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-santander-red"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Minhas Contas Section */}
      <div className="px-4 mt-8">
         <h2 className="text-xl font-medium text-gray-800 mb-4">Minhas contas</h2>
         
         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4">
               <Icons.Wallet className="text-santander-red" size={24} />
            </div>

            <div className="text-xs text-gray-600 mb-1">Ag 4037 Cc 01019649-0 | Titular</div>
            <div className="flex items-center space-x-1 mb-6">
               <span className="font-bold text-gray-800 text-lg">Conta Corrente</span>
               <Icons.ChevronRight size={20} className="text-gray-400" />
            </div>

            <div className="flex justify-between items-end bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg border-t border-gray-100">
               <div>
                  <div className="text-xs text-gray-500 mb-1">Saldo disponível</div>
                  <div className="text-xl font-bold text-gray-900">
                     R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Limite</div>
                  <div className="text-sm font-bold text-gray-900">
                     R$ {user.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
               </div>
            </div>
         </div>

         {/* Account Actions */}
         <div className="flex justify-between px-2 mt-6">
            <button className="flex flex-col items-center space-y-2 w-24">
               <div className="w-12 h-12 rounded-full border border-teal-600 flex items-center justify-center text-teal-700">
                  <Icons.FileText size={22} strokeWidth={1.5} />
               </div>
               <span className="text-[11px] text-center font-medium text-gray-700">Comprovantes</span>
            </button>
             <button className="flex flex-col items-center space-y-2 w-24">
               <div className="w-12 h-12 rounded-full border border-teal-600 flex items-center justify-center text-teal-700">
                  <Icons.CircleDollarSign size={22} strokeWidth={1.5} />
               </div>
               <span className="text-[11px] text-center font-medium text-gray-700">Limite da conta</span>
            </button>
             <button className="flex flex-col items-center space-y-2 w-24">
               <div className="w-12 h-12 rounded-full border border-teal-600 flex items-center justify-center text-teal-700">
                  <Icons.Download size={22} strokeWidth={1.5} />
               </div>
               <span className="text-[11px] text-center font-medium text-gray-700">Trazer dinheiro</span>
            </button>
         </div>
      </div>

      {/* Meus Cartoes */}
      <div className="px-4 mt-8">
         <h2 className="text-xl font-medium text-gray-800 mb-4">Meus cartões</h2>
         
         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
               {/* Card Graphic */}
               <div className="w-20 h-12 rounded bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden shadow-sm flex items-center justify-center">
                   <span className="text-white font-bold italic text-sm">SX</span>
                   <div className="absolute bottom-1 right-1 flex space-x-[2px]">
                      <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                      <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                   </div>
               </div>
               <div className="bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
                  Fatura Aberta
               </div>
            </div>

            <div className="mb-1 text-xs text-gray-500">Crédito ...1875 | Titular</div>
            <div className="flex items-center space-x-1 mb-1">
               <span className="font-bold text-gray-800">SANTANDER SX MASTER</span>
               <Icons.ChevronRight size={16} className="text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Vence: 05/01/2026 / <span className="font-bold">Melhor data: 27/12/2025</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
               <div>
                  <div className="text-xs text-gray-500">Valor da fatura</div>
                  <div className="text-lg font-bold text-gray-900">R$ 3.317,32</div>
               </div>
               <div className="text-right">
                  <div className="text-xs text-gray-500">Disponível</div>
                  <div className="text-lg font-bold text-gray-900">R$ 668,28</div>
               </div>
            </div>
         </div>
      </div>

      {/* Card Actions */}
      <div className="flex justify-between px-6 mt-6">
         <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-teal-500 flex items-center justify-center text-teal-600">
               <Icons.CreditCard size={20} />
            </div>
            <span className="text-[10px] text-center w-16">Cartão Online</span>
         </div>
         <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-teal-500 flex items-center justify-center text-teal-600">
               <Icons.Receipt size={20} />
            </div>
            <span className="text-[10px] text-center w-16">Pagar ou ver fatura</span>
         </div>
         <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-teal-500 flex items-center justify-center text-teal-600">
               <Icons.Home size={20} />
            </div>
            <span className="text-[10px] text-center w-16">Meus limites</span>
         </div>
         <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-teal-500 flex items-center justify-center text-teal-600">
               <Icons.Home size={20} />
            </div>
            <span className="text-[10px] text-center w-16">Parcelar compras</span>
         </div>
      </div>

    </div>
  );
};

export default Home;