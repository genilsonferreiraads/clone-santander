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
  
  if (activeTab === 'chat') {
    return (
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-between shadow-md z-30 relative">
        <button onClick={() => onNavigate('home')} className="p-1">
          <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Atendimento</h1>
        <button className="p-1">
          <span className="text-2xl font-light">×</span>
        </button>
      </header>
    );
  }

  if (activeTab === 'extract') {
     return (
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-between shadow-md z-30 relative">
        <button className="p-1" onClick={() => onNavigate('home')}>
           <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Extrato</h1>
        <button className="text-sm font-medium">Filtrar</button>
      </header>
     );
  }

  if (activeTab === 'pix') {
     return (
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-center shadow-md z-30 relative">
        <button className="p-1 absolute left-4" onClick={() => onNavigate('home')}>
           <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-[17px] font-bold">Pix</h1>
      </header>
     );
  }

  if (activeTab === 'pix_amount') {
     return (
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-center shadow-md z-30 relative">
        <button className="p-1 absolute left-4" onClick={() => onNavigate('pix')}>
           <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-[17px] font-bold">Definir transferência</h1>
      </header>
     );
  }

  if (activeTab === 'pix_payment_method') {
    return (
     <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-center shadow-md z-30 relative">
       <button className="p-1 absolute left-4" onClick={() => onNavigate('pix_amount')}>
          <Icons.ChevronRight className="rotate-180" size={28} />
       </button>
       <h1 className="text-[17px] font-bold">Forma de pagamento</h1>
       <button className="p-1 absolute right-4">
          <Icons.EyeOff size={24} />
       </button>
     </header>
    );
 }

 if (activeTab === 'pix_review') {
    return (
     <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-center shadow-md z-30 relative">
       <button className="p-1 absolute left-4" onClick={() => onNavigate('pix_payment_method')}>
          <Icons.ChevronRight className="rotate-180" size={28} />
       </button>
       <h1 className="text-[17px] font-bold">Revisão</h1>
     </header>
    );
 }

 if (activeTab === 'pix_success') {
    return (
     <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-center shadow-md z-30 relative">
       <button className="p-1 absolute right-4" onClick={() => onNavigate('home')}>
          <Icons.X size={28} />
       </button>
       <h1 className="text-[17px] font-bold">Comprovante</h1>
     </header>
    );
 }

  // Home Header
  return (
    <header className={`bg-santander-red text-white pt-safe px-4 relative z-30 transition-[padding] duration-300 ${activeTab === 'home' ? 'pb-36' : 'pb-6'}`}>
      <div className="flex justify-between items-center mb-6 pt-2">
        <button onClick={onOpenMenu} className="p-1">
          <Icons.MenuStaggered size={28} />
        </button>
        <div className="flex space-x-4">
          <button><Icons.Search size={24} /></button>
          <button onClick={toggleBalance}>
            {showBalance ? <Icons.Eye size={24} /> : <Icons.EyeOff size={24} />}
          </button>
          <button><Icons.Bell size={24} /></button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 transition-all duration-300">
        <div className="flex items-center text-sm font-medium opacity-90">
          <span>Saldo Total</span>
          <Icons.Menu className="ml-2 w-4 h-4 rotate-90 rounded-full border border-white p-[1px]" />
        </div>
        
        <div className={`text-3xl font-bold mt-1 transition-all duration-300 ${showBalance ? '' : 'filter blur-md select-none'}`}>
          {showBalance 
            ? `R$ ${user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
            : 'R$ 860,20' /* Placeholder for blur effect structure */}
        </div>

        <div className="text-sm opacity-90 mt-1">
          Saldo + limite R$ {user.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
        
        <button 
          onClick={() => onNavigate('extract')}
          className="mt-4 text-sm font-semibold border-b border-white/50 pb-0.5"
        >
          Acessar extrato
        </button>
      </div>
    </header>
  );
};

export default Header;