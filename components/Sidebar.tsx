import React from 'react';
import { Icons } from './Icons';
import { User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigateToSettings, onLogout, user }) => {
  const handleSettingsClick = () => {
    onClose();
    onNavigateToSettings();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header - Fixed */}
        <div className="p-4 flex justify-end pt-safe shrink-0">
           <button onClick={onClose}>
             <span className="text-3xl font-light text-gray-500">×</span>
           </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-safe flex flex-col">
            
            {/* Profile Section */}
            <div className="px-6 flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-santander-red flex items-center justify-center text-white text-2xl font-bold mb-4">
                GF
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800 w-3/4 leading-tight">
                {user.name}
              </h2>
            </div>

            {/* Security Shortcuts */}
            <div className="flex justify-center space-x-12 mb-8">
               <div className="flex flex-col items-center space-y-2">
                 <div className="text-santander-red">
                   <Icons.Lock size={28} strokeWidth={1.5} />
                 </div>
                 <span className="text-sm text-gray-700">Segurança</span>
               </div>
               <div className="flex flex-col items-center space-y-2">
                 <div className="text-santander-red">
                   <Icons.Lock size={28} strokeWidth={1.5} />
                 </div>
                 <span className="text-sm text-gray-700">ID Santander</span>
               </div>
            </div>

            {/* Menu Items - Destaques */}
            <div className="border-t border-gray-100">
              <div className="p-4">
                 <h3 className="font-bold text-lg mb-4 text-gray-800">Destaques</h3>
                 <div className="space-y-6">
                    <button className="w-full flex items-center justify-between group">
                       <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-2 rounded-full hidden"></div>
                          <span className="text-gray-700">Novidades no App</span>
                       </div>
                       <Icons.ChevronRight className="text-santander-red" size={20} />
                    </button>
                    <button className="w-full flex items-center justify-between border-t border-gray-100 pt-4">
                       <div className="flex items-center space-x-4">
                          <Icons.Home size={20} className="text-gray-800" />
                          <span className="text-gray-700">Outros Bancos</span>
                       </div>
                       <Icons.ChevronRight className="text-santander-red" size={20} />
                    </button>
                     <button className="w-full flex items-center justify-between border-t border-gray-100 pt-4">
                       <div className="flex items-center space-x-4">
                          <Icons.Home size={20} className="text-gray-800" />
                          <span className="text-gray-700">Shopping</span>
                       </div>
                       <Icons.ChevronRight className="text-santander-red" size={20} />
                    </button>
                     <button className="w-full flex items-center justify-between border-t border-gray-100 pt-4">
                       <div className="flex items-center space-x-4">
                          <Icons.Home size={20} className="text-gray-800" />
                          <span className="text-gray-700">Minhas Reservas</span>
                       </div>
                       <Icons.ChevronRight className="text-santander-red" size={20} />
                    </button>
                 </div>
              </div>
            </div>

            {/* Menu Items - Dia a dia & Configurações */}
            <div className="p-4 border-t border-gray-100 mb-8 flex-1">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Dia a dia</h3>
                <button className="w-full flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <Icons.Receipt size={20} className="text-gray-800" />
                       <span className="text-gray-700">Saldo e extrato</span>
                    </div>
                     <Icons.ChevronRight className="text-santander-red" size={20} />
                </button>
                 
                 {/* Settings Button */}
                 <button 
                    onClick={handleSettingsClick}
                    className="w-full flex items-center justify-between mt-6 pt-4 border-t border-gray-100 group"
                 >
                    <div className="flex items-center space-x-3">
                       <div className="p-1 rounded-full group-active:bg-gray-100">
                          <Icons.Settings size={22} className="text-gray-800" />
                       </div>
                       <span className="text-gray-700 font-medium">Configurações</span>
                    </div>
                     <Icons.ChevronRight className="text-santander-red" size={20} />
                </button>
                
                {/* Logout Button - Added below Settings */}
                <div className="mt-8 pt-4">
                   <button 
                     onClick={onLogout}
                     className="w-full border border-santander-red rounded-full py-3 flex items-center justify-center space-x-2 text-santander-red hover:bg-red-50 transition-colors"
                   >
                     <Icons.LogOut size={20} className="rotate-180" strokeWidth={2} />
                     <span className="font-bold text-[16px]">Sair do app</span>
                   </button>
                </div>
            </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;