import React from 'react';
import { Icons } from '../components/Icons';

interface SearchProps {
  onBack: () => void;
  onNavigateToChat: () => void;
}

const Search: React.FC<SearchProps> = ({ onBack, onNavigateToChat }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col pt-safe font-sans">
      
      {/* Header with Close Button */}
      <div className="px-4 py-4 flex items-center">
        <button onClick={onBack} className="p-1 -ml-2 text-gray-900">
          <Icons.X size={32} strokeWidth={1} />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 mb-8">
        <div className="relative shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icons.Search size={22} className="text-gray-900" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-lg text-gray-900 placeholder-gray-500 text-[16px] outline-none shadow-sm focus:ring-1 focus:ring-gray-200"
            placeholder="Busque aqui..."
            autoFocus
          />
        </div>
      </div>

      {/* Help Text Section */}
      <div className="px-6">
        <p className="text-gray-600 text-[15px] leading-snug mb-4 font-normal">
          Ainda não encontrou o que precisa? Você pode fazer uma nova busca ou falar com o Assistente Virtual para tirar suas dúvidas.
        </p>
        
        <button 
          onClick={onNavigateToChat}
          className="text-santander-red text-[15px] font-medium underline decoration-1 underline-offset-2"
        >
          Fale com o Assistente Virtual
        </button>
      </div>

    </div>
  );
};

export default Search;