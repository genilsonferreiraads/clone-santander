import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { User, Transaction } from '../types';

interface SettingsProps {
  onBack: () => void;
  user: User;
  onUpdateUser: (newUser: User, newTransaction?: Transaction) => void;
}

const PLATFORMS = [
  { name: 'Lançamentos LTDA', cnpj: '21.093.570/0001-38', display: 'Hotmart (Lançamentos LTDA)' },
  { name: 'Monetizze Meios de Pagamento LTDA', cnpj: '23.055.665/0001-06', display: 'Monetizze' },
  { name: 'Kiwify Meios de Pagamento LTDA', cnpj: '36.149.947/0001-06', display: 'Kiwify' },
  { name: 'Eduzz Tecnologia LTDA', cnpj: '19.123.023/0001-18', display: 'Eduzz' },
  { name: 'Braip Tecnologia LTDA', cnpj: '34.195.122/0001-64', display: 'Braip' },
  { name: 'Tikto Meios de Pagamento LTDA', cnpj: '34.331.439/0001-20', display: 'Tikto' },
  { name: 'Perfect Pay Tecnologia LTDA', cnpj: '32.844.755/0001-57', display: 'Perfect Pay' },
  { name: 'Kirvano Meios de Pagamento LTDA', cnpj: '49.378.140/0001-02', display: 'Kirvano' },
  { name: 'Dozzo Pagamentos LTDA', cnpj: '41.222.111/0001-99', display: 'Dozzo' },
  { name: 'PayT Tecnologia e Pagamentos LTDA', cnpj: '35.111.000/0001-88', display: 'PayT' },
];

const Settings: React.FC<SettingsProps> = ({ onBack, user, onUpdateUser }) => {
  const [amountToAdd, setAmountToAdd] = useState('0,00');
  const [selectedPlatformIndex, setSelectedPlatformIndex] = useState(0);
  const [payeeName, setPayeeName] = useState('');
  const [payeeBank, setPayeeBank] = useState('BCO SANTANDER (BRASIL) S.A.');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedPayee = localStorage.getItem('santander_clone_settings_payee');
    if (savedPayee) {
        const parsed = JSON.parse(savedPayee);
        setPayeeName(parsed.name || '');
        setPayeeBank(parsed.bank || 'BCO SANTANDER (BRASIL) S.A.');
    }
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmountToAdd('0,00');
      return;
    }
    const amount = parseInt(rawValue, 10) / 100;
    setAmountToAdd(amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amountToAdd.replace(/\./g, '').replace(',', '.'));
    const platform = PLATFORMS[selectedPlatformIndex];
    
    // 1. Update Balance (Add)
    const newBalance = user.balance + numericAmount;
    
    // 2. Create Transaction if amount > 0
    let newTx: Transaction | undefined;
    if (numericAmount > 0) {
      newTx = {
        id: 'manual_' + Date.now(),
        type: 'pix_received',
        description: `Pix recebido\n${platform.name}`,
        amount: numericAmount,
        date: new Date().toISOString(), // Agora salva com o horário completo
      };
    }

    // 3. Save Payee settings (Simulator)
    const payeeData = { name: payeeName, bank: payeeBank };
    localStorage.setItem('santander_clone_settings_payee', JSON.stringify(payeeData));

    // 4. Update App State
    onUpdateUser({ ...user, balance: newBalance }, newTx);

    setShowSuccess(true);
    setAmountToAdd('0,00');
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-santander-red text-white p-4 pt-safe flex items-center justify-between shadow-md z-30 relative">
        <button onClick={onBack} className="p-1">
          <Icons.ChevronRight className="rotate-180" size={28} />
        </button>
        <h1 className="text-lg font-bold">Configurações do Clone</h1>
        <div className="w-8"></div>
      </header>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Add Balance Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Icons.CircleDollarSign size={20} className="text-santander-red" />
                Adicionar Saldo (Entrada Pix)
            </h2>
            <p className="text-xs text-gray-500 mb-4">O valor será somado ao seu saldo e aparecerá no extrato.</p>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor a Adicionar (R$)</label>
                <input 
                    type="text" 
                    value={amountToAdd}
                    onChange={handleAmountChange}
                    inputMode="numeric"
                    className="w-full border border-gray-300 rounded p-3 text-lg font-bold text-gray-900 focus:border-santander-red outline-none"
                    placeholder="0,00"
                />
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quem enviou o Pix? (Plataforma)</label>
                <select 
                    value={selectedPlatformIndex}
                    onChange={(e) => setSelectedPlatformIndex(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded p-3 text-gray-900 focus:border-santander-red outline-none bg-white text-[15px]"
                >
                    {PLATFORMS.map((p, idx) => (
                        <option key={idx} value={idx}>{p.display}</option>
                    ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-2 px-1">
                   Razão Social: {PLATFORMS[selectedPlatformIndex].name}<br/>
                   CNPJ: {PLATFORMS[selectedPlatformIndex].cnpj}
                </p>
            </div>
        </div>

        {/* Pix Simulator Settings */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Icons.Pix size={20} className="text-santander-red" />
                Simulador Pix (Recebedor)
            </h2>
            <p className="text-xs text-gray-500 mb-4">Quem você verá como recebedor ao simular um envio.</p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recebedor</label>
                <input 
                    type="text" 
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:border-santander-red outline-none"
                    placeholder="Ex: João da Silva"
                />
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco do Recebedor</label>
                <input 
                    type="text" 
                    value={payeeBank}
                    onChange={(e) => setPayeeBank(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:border-santander-red outline-none"
                    placeholder="Ex: BANCO INTER S.A."
                />
            </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
           <p className="text-sm text-gray-600">
             Saldo Atual: <span className="font-bold">R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </p>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 pb-8 z-40">
        <button 
            onClick={handleSave}
            className="w-full bg-santander-red text-white font-bold text-[16px] py-4 rounded hover:bg-santander-darkRed transition-colors flex justify-center items-center gap-2 shadow-lg"
        >
            {showSuccess ? (
                <>
                    <Icons.Check size={20} />
                    Processado com sucesso!
                </>
            ) : 'Adicionar e Salvar'}
        </button>
      </div>

    </div>
  );
};

export default Settings;