import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';

interface LoginPasswordProps {
  onLogin: () => void;
  onSwitchToFaceId: () => void;
  user: User;
}

const LoginPassword: React.FC<LoginPasswordProps> = ({ onLogin, onSwitchToFaceId, user }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    // Validate Password
    if (password === '225810') {
      onLogin();
    } else {
      setError(true);
      // Optional: Clear error after typing
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(false);
  };

  const isButtonEnabled = password.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans pb-10">
      
      {/* Top Header */}
      <div className="w-full pt-safe px-4 flex items-center mb-8 mt-2 relative">
         <button onClick={onSwitchToFaceId} className="text-santander-red p-1 -ml-2 absolute left-4">
            <Icons.ChevronRight className="rotate-180" size={32} strokeWidth={1} />
         </button>
         <div className="w-full flex justify-center">
            <div className="text-santander-red flex items-center">
               <Icons.SantanderLogo size={36} />
               <span className="font-bold text-2xl tracking-tight ml-2">Santander</span>
            </div>
         </div>
         <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="w-full px-6 flex-1 flex flex-col items-center mt-4">
         
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

         <div className="w-full">
            <label className="text-[17px] text-gray-900 mb-2 block">Digite a senha de acesso</label>
            
            <div className={`relative w-full border-2 rounded-lg transition-colors ${error ? 'border-santander-red' : 'border-santander-red'}`}>
               <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleChange}
                  className="w-full h-12 px-4 pr-12 text-[18px] text-gray-900 outline-none bg-transparent"
               />
               <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-santander-red"
               >
                  {showPassword ? <Icons.EyeOff size={24} /> : <Icons.Eye size={24} />}
               </button>
            </div>
            
            {error && (
               <div className="flex items-center text-santander-red mt-2 space-x-1">
                  <span className="text-lg">⚠</span>
                  <span className="text-[15px]">Este campo é obrigatório.</span> 
                  {/* Or "Senha incorreta" based on logic, but screenshot says "Este campo é obrigatório" which usually implies empty */}
               </div>
            )}

            <button className="flex items-center space-x-2 text-teal-600 font-medium text-[15px] underline decoration-1 underline-offset-2 mt-6">
                <div className="rotate-45">
                   <Icons.Lock size={16} /> 
                </div>
                <span>Esqueceu sua senha?</span>
             </button>
         </div>

      </div>

      {/* Bottom Actions */}
      <div className="w-full px-6 flex flex-col items-center space-y-6">
         <button 
           onClick={handleLogin}
           disabled={!isButtonEnabled}
           className={`w-full font-bold text-[16px] py-3.5 rounded-full transition-colors shadow-sm ${
              isButtonEnabled 
              ? 'bg-gray-200 text-gray-400' /* Screenshot shows it gray initially, implies validation on server or specific length? Actually, screenshot 2 shows Entrar but it looks disabled or gray. Let's make it red if filled to be usable */
              : 'bg-gray-200 text-gray-400'
           }`}
           style={{ backgroundColor: isButtonEnabled ? '#EC0000' : '#E5E7EB', color: isButtonEnabled ? '#FFFFFF' : '#9CA3AF' }}
         >
           Entrar
         </button>
         
         <button 
           onClick={onSwitchToFaceId}
           className="flex items-center space-x-2 text-teal-600 font-medium text-[15px] underline decoration-1 underline-offset-2"
         >
            <Icons.ScanFace size={20} />
            <span>Acessar com biometria</span>
         </button>
      </div>

    </div>
  );
};

export default LoginPassword;
