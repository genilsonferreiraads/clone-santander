import React from 'react';
import { Icons } from '../components/Icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-santander-red flex items-center justify-center">
      <div className="text-white animate-pulse">
        <Icons.SantanderLogo size={110} />
      </div>
    </div>
  );
};

export default SplashScreen;