import React from 'react';
import { Icons } from '../components/Icons';

interface NotificationsProps {
  onBack: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Custom Header */}
      <header className="bg-white p-4 pt-safe flex items-center justify-between relative">
        <button onClick={onBack} className="p-1 -ml-2">
          <Icons.ChevronRight className="rotate-180 text-gray-900" size={32} strokeWidth={1} />
        </button>
        
        <h1 className="text-[17px] font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
          Notificações
        </h1>

        <button className="p-1 -mr-2 text-gray-900">
           <Icons.Settings size={24} strokeWidth={1.5} />
        </button>
      </header>

      {/* List Content */}
      <div className="flex-1 mt-4 px-4">
        
        {/* Confirmações em aberto */}
        <button className="w-full flex justify-between items-center py-5 border-b border-gray-100 group active:bg-gray-50">
            <span className="text-[16px] text-gray-900 font-normal">Confirmações em aberto</span>
            <Icons.ChevronRight className="text-gray-400" size={20} />
        </button>

        {/* Notificações gerais */}
        <button className="w-full flex justify-between items-center py-5 border-b border-gray-100 group active:bg-gray-50">
            <span className="text-[16px] text-gray-900 font-normal">Notificações gerais</span>
            <Icons.ChevronRight className="text-gray-400" size={20} />
        </button>

      </div>
    </div>
  );
};

export default Notifications;