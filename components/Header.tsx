
import React from 'react';
import { Icons } from './Icons';
import { User } from '../types';

interface HeaderProps {
  user: User;
  showBalance: boolean;
  toggleBalance: () => void;
  onOpenMenu: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, showBalance, toggleBalance, onOpenMenu, activeTab, onNavigate }) => {
  
  const FIXED_LIMIT = 800;
  const totalWithLimit = user.balance + FIXED_LIMIT;

  const renderSubHeader = (title: string, leftAction?: React.ReactNode, rightAction?: React.ReactNode) => (
     <header className="bg-santander-red text-white pt-safe shadow-md z-30 relative shrink-0">
        <div className="h-[64px] px-4 flex items-center justify-between relative">
            <div className="z-10 flex items-center h-full">
               {leftAction}
            </div>
            
            <h1 className="absolute inset-0 flex items-center justify-center text-[18px] font-bold pointer-events-none px-16 text-center">
               {title}
            </h1>

            <div className="z-10 flex items-center h-full">
               {rightAction}
            </div>
        </div>
     </header>
  );

  if (activeTab === 'chat') {
    return renderSubHeader('Atendimento', (
      <button onClick={() => onNavigate('home')} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors">
         <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
      </button>
    ), (
      <button className="p-2 -mr-2">
         <span className="text-3xl font-light leading-none relative top-[-2px]">×</span>
      </button>
    ));
  }

  if (activeTab === 'extract') {
     return renderSubHeader('Extrato', (
        <button onClick={() => onNavigate('home')} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors">
           <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
        </button>
     ), (
        <button className="text-[14px] font-bold active:opacity-80 p-2">Filtrar</button>
     ));
  }

  if (activeTab === 'pix') {
     return renderSubHeader('Pix', (
        <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" onClick={() => onNavigate('home')}>
           <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
        </button>
     ));
  }

  if (activeTab === 'pix_amount') {
     return renderSubHeader('Definir transferência', (
        <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" onClick={() => onNavigate('pix')}>
           <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
        </button>
     ));
  }

  if (activeTab === 'pix_payment_method') {
    return renderSubHeader('Forma de pagamento', (
       <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" onClick={() => onNavigate('pix_amount')}>
          <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
       </button>
    ), (
       <button className="p-2 -mr-2 rounded-full active:bg-white/10 transition-colors">
          <Icons.EyeOff size={24} />
       </button>
    ));
 }

 if (activeTab === 'pix_review') {
    return renderSubHeader('Revisão', (
       <button className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" onClick={() => onNavigate('pix_payment_method')}>
          <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
       </button>
    ));
 }

 if (activeTab === 'pix_success') {
    return renderSubHeader('Comprovante', null, (
       <button className="p-2 -mr-2 rounded-full active:bg-white/10 transition-colors" onClick={() => onNavigate('home')}>
          <Icons.X size={28} />
       </button>
    ));
 }

  return (
    <header className={`bg-santander-red text-white pt-safe px-4 relative z-30 transition-[padding] duration-300 ${activeTab === 'home' ? 'pb-36' : 'pb-6'}`}>
      <div className="h-[64px] flex justify-between items-center mb-2">
        <button onClick={onOpenMenu} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors">
          <Icons.MenuStaggered size={28} />
        </button>
        <div className="flex space-x-3">
          <button onClick={() => onNavigate('search')} className="p-2"><Icons.Search size={24} /></button>
          <button onClick={toggleBalance} className="p-2">
            {showBalance ? <Icons.Eye size={24} /> : <Icons.EyeOff size={24} />}
          </button>
          <button onClick={() => onNavigate('notifications')} className="p-2"><Icons.Bell size={24} /></button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 transition-all duration-300 pb-4">
        <div className="flex items-center text-sm font-medium opacity-90">
          <span>Saldo Total</span>
          <Icons.Menu className="ml-2 w-4 h-4 rotate-90 rounded-full border border-white p-[1px]" />
        </div>
        
        <div className={`text-3xl font-bold mt-1 transition-all duration-300 ${showBalance ? '' : 'filter blur-md select-none'}`}>
          {showBalance 
            ? `R$ ${user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
            : 'R$ 860,20'}
        </div>

        <div className="text-sm opacity-90 mt-1 flex items-center justify-center gap-1">
          <span>Saldo + limite</span>
          <span className={`transition-all duration-300 ${showBalance ? '' : 'filter blur-md select-none'}`}>
            R$ {totalWithLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <button 
          onClick={() => onNavigate('extract')}
          className="mt-4 text-sm font-semibold border-b border-white/50 pb-0.5 active:opacity-60"
        >
          Acessar extrato
        </button>
      </div>
    </header>
  );
};

export default Header;
