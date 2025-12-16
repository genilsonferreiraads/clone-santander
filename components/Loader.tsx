import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-[2px]">
      <div className="flex flex-col items-center">
        {/* Santander-style Red Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-santander-red rounded-full animate-spin"></div>
        <span className="mt-4 text-sm font-medium text-gray-500 animate-pulse">Carregando...</span>
      </div>
    </div>
  );
};

export default Loader;