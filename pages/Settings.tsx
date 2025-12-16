import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';

interface SettingsProps {
  onBack: () => void;
  user: User;
  onUpdateUser: (newUser: User) => void;
}

const BANK_OPTIONS = [
  'BCO SANTANDER (BRASIL) S.A.',
  'NU PAGAMENTOS - IP',
  'BANCO DO BRASIL S.A.',
  'BANCO BRADESCO S.A.',
  'ITAÚ UNIBANCO S.A.',
  'CAIXA ECONOMICA FEDERAL',
  'BANCO INTER S.A.',
  'BANCO C6 S.A.',
  'BANCO ORIGINAL S.A.',
  'BANCO NEON S.A.',
  'MERCADO PAGO IP LTDA.',
  'PICPAY SERVICOS S.A.',
  'PAGSEGURO INTERNET IP S.A.',
  'BANCO BTG PACTUAL S.A.',
  'BANCO SAFRA S.A.',
  'BANCO VOTORANTIM S.A.',
  'BANCO PAN S.A.',
  'BANCO XP S.A.',
  'BANCO DAYCOVAL S.A.'
];

const Settings: React.FC<SettingsProps> = ({ onBack, user, onUpdateUser }) => {
  // Initialize with properly formatted currency string
  const [balanceInput, setBalanceInput] = useState(user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  const [payeeName, setPayeeName] = useState('');
  const [payeeBank, setPayeeBank] = useState('BCO SANTANDER (BRASIL) S.A.');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load Payee Settings
    const savedPayee = localStorage.getItem('santander_clone_settings_payee');
    if (savedPayee) {
        const parsed = JSON.parse(savedPayee);
        setPayeeName(parsed.name || '');
        setPayeeBank(parsed.bank || 'BCO SANTANDER (BRASIL) S.A.');
    }
  }, []);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove everything that is not a digit
    const rawValue = e.target.value.replace(/\D/g, '');

    if (!rawValue) {
      setBalanceInput('0,00');
      return;
    }

    // Convert to float (divide by 100 to get cents)
    const amount = parseInt(rawValue, 10) / 100;
    
    // Format back to currency string
    const formatted = amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    setBalanceInput(formatted);
  };

  const handleSave = () => {
    // 1. Save Balance
    // Remove thousands separator (.) and replace decimal separator (,) with (.) to get valid float string
    const numericBalance = parseFloat(balanceInput.replace(/\./g, '').replace(',', '.'));
    
    if (!isNaN(numericBalance)) {
        // Save to global storage for persistence
        localStorage.setItem('santander_clone_user_balance', numericBalance.toString());
        // Update App state
        onUpdateUser({ ...user, balance: numericBalance });
    }

    // 2. Save Payee
    const payeeData = {
        name: payeeName,
        bank: payeeBank
    };
    localStorage.setItem('santander_clone_settings_payee', JSON.stringify(payeeData));

    // Show Feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-between shadow-md z-30 relative">
        <button onClick={onBack} className="p-1">
          <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Configurações do Clone</h1>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      <div className="p-4 space-y-6 flex-1">
        
        {/* User Settings */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icons.User size={20} className="text-santander-red" />
                Sua Conta
            </h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Saldo da Conta (R$)</label>
                <input 
                    type="text" 
                    value={balanceInput}
                    onChange={handleBalanceChange}
                    inputMode="numeric"
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:border-santander-red outline-none"
                    placeholder="0,00"
                />
            </div>
        </div>

        {/* Pix Simulator Settings */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icons.Pix size={20} className="text-santander-red" />
                Simulador Pix
            </h2>
            <p className="text-sm text-gray-500 mb-4">
                Defina quem aparecerá como recebedor ao digitar qualquer chave pix.
            </p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recebedor</label>
                <input 
                    type="text" 
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:border-santander-red outline-none"
                    placeholder="Nome Completo"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco do Recebedor</label>
                <select 
                    value={payeeBank}
                    onChange={(e) => setPayeeBank(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:border-santander-red outline-none bg-white text-sm"
                >
                    {BANK_OPTIONS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                    ))}
                </select>
            </div>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-gray-200 pb-8">
        <button 
            onClick={handleSave}
            className="w-full bg-santander-red text-white font-medium text-[16px] py-3 rounded hover:bg-santander-darkRed transition-colors flex justify-center items-center gap-2"
        >
            {showSuccess ? (
                <>
                    <Icons.Check size={20} />
                    Salvo com sucesso!
                </>
            ) : 'Salvar Configurações'}
        </button>
      </div>

    </div>
  );
};

export default Settings;