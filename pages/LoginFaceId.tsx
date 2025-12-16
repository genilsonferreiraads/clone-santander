import React from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';

interface LoginFaceIdProps {
  onLogin: () => void;
  onSwitchToPassword: () => void;
  user: User;
}

const LoginFaceId: React.FC<LoginFaceIdProps> = ({ onLogin, onSwitchToPassword, user }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between font-sans pb-10">
      
      {/* Top Header */}
      <div className="w-full pt-safe px-4 flex items-center mb-4 mt-2">
         <button className="text-santander-red p-1 -ml-2">
            <Icons.ChevronRight className="rotate-180" size={32} strokeWidth={1} />
         </button>
         <div className="flex-1 flex justify-center mr-8">
            <div className="text-santander-red">
               <Icons.SantanderLogo size={36} />
               <span className="font-bold text-2xl tracking-tight ml-2 align-middle">Santander</span>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 -mt-20">
         
         <div className="text-center mb-10">
            <h1 className="text-[26px] font-bold text-santander-red leading-tight">
               Olá, Genilson Ferreira
            </h1>
            <div className="flex items-center justify-center gap-2">
               <h1 className="text-[26px] font-bold text-santander-red leading-tight">
                  Dos Santos
               </h1>
               <Icons.Edit3 className="text-santander-red" size={20} />
            </div>
         </div>

         <div className="mb-8">
            <Icons.ScanFace size={80} strokeWidth={1.5} className="text-gray-900" />
         </div>

         <p className="text-[15px] text-gray-900 text-center max-w-[280px] leading-snug">
            Você precisa entrar com o Face ID para acessar.
         </p>

      </div>

      {/* Bottom Actions */}
      <div className="w-full px-6 flex flex-col items-center space-y-6">
         <button 
           onClick={onLogin}
           className="w-full bg-santander-red text-white font-bold text-[16px] py-3.5 rounded-full hover:bg-santander-darkRed transition-colors shadow-sm"
         >
           Entrar com Face ID
         </button>
         
         <button 
           onClick={onSwitchToPassword}
           className="flex items-center space-x-2 text-teal-600 font-medium text-[15px] underline decoration-1 underline-offset-2"
         >
            <div className="rotate-45">
               <Icons.Lock size={16} /> {/* Using Lock as a generic key placeholder or Key icon if available, Lock is close enough for concept */}
            </div>
            <span>Entrar com senha</span>
         </button>
      </div>

    </div>
  );
};

export default LoginFaceId;
