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

  const handleBiometricAuth = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);

    // Tentativa de disparar o prompt nativo (WebAuthn)
    // No iOS Safari, isso ativa o FaceID/TouchID se configurado.
    if (window.PublicKeyCredential) {
      try {
        // Criamos um desafio dummy apenas para forçar o sistema a abrir o diálogo de biometria
        // Nota: Em um app real, isso exigiria integração com backend. Aqui serve para o "feeling" do UI.
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // O timeout de simulação garante que o usuário veja a animação mesmo que o FaceID seja instantâneo
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1200)), // Delay estético
          navigator.credentials.get({
            publicKey: {
              challenge,
              userVerification: "required",
              allowCredentials: [] // Força a busca por autenticadores de plataforma
            }
          }).catch(e => console.log("Biometric prompt handled or cancelled")),
        ]);
      } catch (err) {
        console.log("WebAuthn not fully supported or cancelled:", err);
      }
    } else {
      // Fallback para dispositivos sem suporte a WebAuthn (Simulação)
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsAuthenticating(false);
    onLogin();
  };

  // Disparar automaticamente ao montar a tela, como no app real
  useEffect(() => {
    const timer = setTimeout(() => {
      handleBiometricAuth();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between font-sans pb-10">
      
      {/* Top Header */}
      <div className="w-full pt-safe px-4 flex items-center mb-4 mt-2">
         <button className="text-santander-red p-1 -ml-2" onClick={onSwitchToPassword}>
            <Icons.ChevronRight className="rotate-180" size={32} strokeWidth={1} />
         </button>
         <div className="flex-1 flex justify-center mr-8">
            <div className="text-santander-red flex items-center">
               <Icons.SantanderLogo size={36} />
               <span className="font-bold text-2xl tracking-tight ml-2">Santander</span>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 -mt-20">
         
         <div className="text-center mb-10">
            <h1 className="text-[26px] font-bold text-santander-red leading-tight">
               Olá, {user.name.split(' ')[0]} {user.name.split(' ')[1]}
            </h1>
            <div className="flex items-center justify-center gap-2">
               <h1 className="text-[26px] font-bold text-santander-red leading-tight">
                  {user.name.split(' ').slice(2).join(' ')}
               </h1>
               <Icons.Edit3 className="text-santander-red" size={20} />
            </div>
         </div>

         <div className="mb-8 relative">
            <div className={`transition-all duration-500 ${isAuthenticating ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}`}>
                <Icons.ScanFace size={80} strokeWidth={1.2} className="text-gray-900" />
            </div>
            
            {isAuthenticating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-santander-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
         </div>

         <p className="text-[15px] text-gray-900 text-center max-w-[280px] leading-snug">
            {isAuthenticating 
              ? "Autenticando..." 
              : "Você precisa entrar com o Face ID para acessar."}
         </p>

      </div>

      {/* Bottom Actions */}
      <div className="w-full px-6 flex flex-col items-center space-y-6">
         <button 
           onClick={handleBiometricAuth}
           disabled={isAuthenticating}
           className="w-full bg-santander-red text-white font-bold text-[16px] py-3.5 rounded-full hover:bg-santander-darkRed transition-colors shadow-sm active:scale-[0.98] disabled:bg-gray-300"
         >
           {isAuthenticating ? "Processando..." : "Entrar com Face ID"}
         </button>
         
         <button 
           onClick={onSwitchToPassword}
           disabled={isAuthenticating}
           className="flex items-center space-x-2 text-teal-600 font-medium text-[15px] underline decoration-1 underline-offset-2 disabled:opacity-50"
         >
            <div className="rotate-45">
               <Icons.Lock size={16} />
            </div>
            <span>Entrar com senha</span>
         </button>
      </div>

    </div>
  );
};

export default LoginFaceId;