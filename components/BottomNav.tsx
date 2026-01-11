import React from 'react';
import { Icons } from './Icons';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Icons.Home },
    { id: 'pay', label: 'Pagar', icon: Icons.Receipt },
    { id: 'cards', label: 'Cartões', icon: Icons.CreditCard }, // Using cards as icon
    { id: 'chat', label: 'Chat', icon: Icons.MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-40 pb-safe">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full space-y-1 ${isActive ? 'text-santander-red' : 'text-gray-500'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;