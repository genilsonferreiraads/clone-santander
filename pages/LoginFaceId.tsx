import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';

interface LoginFaceIdProps {
  onLogin: () => void;
  onSwitchToPassword: () => void;
  user: User;
}

const LoginFaceId: React.FC<LoginFaceIdProps> = ({ onLogin, onSwitchToPassword, user }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const triggerFaceId = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    setAuthStatus('scanning');

    // Simulação do tempo de resposta do Face ID real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAuthStatus('success');
    
    // Pequena pausa no ícone de "check" antes de entrar
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsAuthenticating(false);
    onLogin();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerFaceId();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between font-sans pb-10 relative overflow-hidden">
      
      {/* Background Content (Blurred when authenticating) */}
      <div className={`w-full flex-1 flex flex-col transition-all duration-500 ${isAuthenticating ? 'blur-sm scale-[0.98]' : ''}`}>
        
        {/* Top Header - Improved Spacing */}
        <div className="w-full pt-safe px-4 flex items-center justify-between h-16 shrink-0">
           <button className="text-santander-red p-1" onClick={onSwitchToPassword}>
              <Icons.ChevronRight className="rotate-180" size={28} strokeWidth={2} />
           </button>
           
           <div className="flex items-center text-santander-red">
              <Icons.SantanderLogo size={32} />
              <span className="font-bold text-xl tracking-tight ml-2">Santander</span>
           </div>
           
           <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* User Greeting & Main Icon */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-8">
           <div className="text-center mb-12">
              <h1 className="text-[24px] font-bold text-santander-red leading-tight">
                 Olá, {user.name.split(' ')[0]} {user.name.split(' ')[1]}
              </h1>
              <div className="flex items-center justify-center gap-2">
                 <h1 className="text-[24px] font-bold text-santander-red leading-tight">
                    {user.name.split(' ').slice(2).join(' ')}
                 </h1>
                 <Icons.Edit3 className="text-santander-red mb-1" size={18} />
              </div>
           </div>

           <div className="mb-10">
              <div className="p-4 rounded-3xl bg-gray-50/50">
                <Icons.ScanFace size={70} strokeWidth={1.2} className="text-gray-900" />
              </div>
           </div>

           <p className="text-[15px] text-gray-700 text-center max-w-[260px] leading-relaxed">
              Você precisa entrar com o Face ID para acessar.
           </p>
        </div>

        {/* Bottom Actions */}
        <div className="w-full px-6 flex flex-col items-center space-y-6 shrink-0 mt-4">
           <button 
             onClick={triggerFaceId}
             className="w-full bg-santander-red text-white font-bold text-[16px] py-4 rounded-full shadow-md active:scale-[0.98] transition-transform"
           >
             Entrar com Face ID
           </button>
           
           <button 
             onClick={onSwitchToPassword}
             className="flex items-center space-x-2 text-teal-600 font-medium text-[15px] underline decoration-1 underline-offset-2 pb-2"
           >
              <div className="rotate-45">
                 <Icons.Lock size={16} />
              </div>
              <span>Entrar com senha</span>
           </button>
        </div>
      </div>

      {/* High-Fidelity Native iOS Face ID Prompt Simulation */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-300">
           <div className="w-[155px] h-[155px] bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl flex flex-col items-center justify-center border border-white/40 animate-in zoom-in-95 duration-200">
              
              <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
                 {authStatus === 'scanning' ? (
                   <>
                     <Icons.ScanFace size={55} strokeWidth={1.5} className="text-gray-800 animate-pulse" />
                     <div className="absolute inset-0 border-2 border-gray-300 rounded-2xl opacity-10"></div>
                   </>
                 ) : (
                   <div className="w-14 h-14 rounded-full bg-[#34C759] flex items-center justify-center animate-in zoom-in duration-300 shadow-sm">
                      <Icons.Check size={36} strokeWidth={4} className="text-white" />
                   </div>
                 )}
              </div>

              <span className="text-[16px] font-semibold text-gray-800 tracking-tight">
                 {authStatus === 'scanning' ? 'Face ID' : 'Concluído'}
              </span>
           </div>
        </div>
      )}

    </div>
  );
};

export default LoginFaceId;