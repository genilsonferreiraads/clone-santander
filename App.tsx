import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import Home from './pages/Home';
import Extract from './pages/Extract';
import Chat from './pages/Chat';
import PixArea from './pages/PixArea';
import PixAmount from './pages/PixAmount';
import PixPaymentMethod from './pages/PixPaymentMethod';
import PixReview from './pages/PixReview';
import PixSuccess from './pages/PixSuccess';
import PixReceiptDetail from './pages/PixReceiptDetail';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import TransactionDetail from './pages/TransactionDetail';
import LoginFaceId from './pages/LoginFaceId';
import LoginPassword from './pages/LoginPassword';
import SplashScreen from './pages/SplashScreen';
import { USER_DATA, TRANSACTIONS as INITIAL_TRANSACTIONS } from './constants';
import { TransferTarget, User, Transaction } from './types';

function App() {
  // Start with 'splash' state
  const [authStep, setAuthStep] = useState<'splash' | 'face_id' | 'password' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Transaction State
  const [transferTarget, setTransferTarget] = useState<TransferTarget | null>(null);
  const [transactionAmount, setTransactionAmount] = useState('0,00');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Load User Data from localStorage (persistence)
  const [user, setUser] = useState<User>(() => {
    const savedBalance = localStorage.getItem('santander_clone_user_balance');
    const baseUser = { ...USER_DATA };
    if (savedBalance) {
      const parsedBalance = parseFloat(savedBalance);
      if (!isNaN(parsedBalance)) {
        baseUser.balance = parsedBalance;
      }
    }
    return baseUser;
  });

  // Load Transactions from localStorage (persistence)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('santander_clone_transactions');
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      return [...parsed, ...INITIAL_TRANSACTIONS];
    }
    return INITIAL_TRANSACTIONS;
  });

  // Effect to handle Splash Screen timer
  useEffect(() => {
    if (authStep === 'splash') {
      const timer = setTimeout(() => {
        setAuthStep('face_id');
      }, 3000); // 3 seconds display time
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  // Handle Login Success
  const handleLoginSuccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAuthStep('app');
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsLoading(true);
    setTimeout(() => {
      setAuthStep('face_id');
      setActiveTab('home');
      setIsLoading(false);
    }, 500);
  };

  // Unified navigation handler
  const handleNavigate = (tab: string) => {
    if (activeTab === tab) return;

    if (tab === 'search' || tab === 'notifications') {
      setActiveTab(tab);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 1000); 
  };

  const handleNavigateToAmount = (target: TransferTarget) => {
    setTransferTarget(target);
    handleNavigate('pix_amount');
  };

  const handleAmountContinue = (amount: string) => {
    setTransactionAmount(amount);
    handleNavigate('pix_payment_method');
  };

  const handleConfirmTransaction = () => {
    const numericAmount = parseFloat(transactionAmount.replace(/\./g, '').replace(',', '.'));

    if (!isNaN(numericAmount)) {
      const newBalance = user.balance - numericAmount;
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('santander_clone_user_balance', newBalance.toString());

      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'pix_sent',
        description: `Pix enviado\n${transferTarget?.name || 'Desconhecido'}`, 
        amount: -numericAmount,
        date: new Date().toISOString().split('T')[0],
        target: transferTarget || undefined
      };

      const updatedTransactions = [newTx, ...transactions];
      setTransactions(updatedTransactions);

      const userTransactions = updatedTransactions.filter(t => !['t1','t2','t3','t4','t5'].includes(t.id));
      localStorage.setItem('santander_clone_transactions', JSON.stringify(userTransactions));
    }

    handleNavigate('pix_success');
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    handleNavigate('transaction_detail');
  };

  const handleOpenReceiptFromDetail = () => {
    if (selectedTransaction) {
      if (selectedTransaction.target) {
         setTransferTarget(selectedTransaction.target);
      } else {
         const nameParts = selectedTransaction.description.split('\n');
         const name = nameParts.length > 1 ? nameParts[1] : 'Desconhecido';
         setTransferTarget({ name: name, cpf: '***.***.***-**', bank: 'Banco' });
      }

      const absAmount = Math.abs(selectedTransaction.amount);
      const formattedAmount = absAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      setTransactionAmount(formattedAmount);

      handleNavigate('pix_receipt_detail');
    }
  };

  // --- Auth Flow Rendering ---

  if (authStep === 'splash') {
    return <SplashScreen />;
  }

  if (authStep === 'face_id') {
    return (
      <LoginFaceId 
        user={user} 
        onLogin={handleLoginSuccess}
        onSwitchToPassword={() => setAuthStep('password')}
      />
    );
  }

  if (authStep === 'password') {
    return (
      <LoginPassword 
        user={user} 
        onLogin={handleLoginSuccess}
        onSwitchToFaceId={() => setAuthStep('face_id')}
      />
    );
  }

  // --- Main App Rendering ---

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleNavigate} user={user} />;
      case 'search':
        return (
          <Search 
            onBack={() => handleNavigate('home')} 
            onNavigateToChat={() => handleNavigate('chat')} 
          />
        );
      case 'notifications':
        return (
          <Notifications onBack={() => handleNavigate('home')} />
        );
      case 'extract':
        return (
          <Extract 
            user={user} 
            transactions={transactions} 
            onTransactionClick={handleTransactionClick}
          />
        );
      case 'pay':
        return <div className="p-8 text-center text-gray-500">Tela de Pagamento (Mock)</div>; 
      case 'cards':
        return <div className="p-8 text-center text-gray-500">Tela de Cartões (Mock)</div>;
      case 'chat':
        return <Chat />;
      case 'pix':
        return <PixArea onNavigateToAmount={handleNavigateToAmount} />;
      case 'pix_amount':
        return (
          <PixAmount 
            target={transferTarget} 
            onContinue={handleAmountContinue}
          />
        );
      case 'pix_payment_method':
        return <PixPaymentMethod onContinue={() => handleNavigate('pix_review')} user={user} />;
      case 'pix_review':
        return (
          <PixReview 
             target={transferTarget} 
             amount={transactionAmount} 
             onConfirm={handleConfirmTransaction}
          />
        );
      case 'pix_success':
        return (
          <PixSuccess 
             target={transferTarget} 
             amount={transactionAmount}
             onShowReceipt={() => handleNavigate('pix_receipt_detail')}
             onNewPix={() => handleNavigate('pix')}
             user={user}
          />
        );
      case 'pix_receipt_detail':
        return (
          <PixReceiptDetail 
             target={transferTarget} 
             amount={transactionAmount}
             onClose={() => handleNavigate(selectedTransaction ? 'transaction_detail' : 'pix_success')}
             user={user}
          />
        );
      case 'transaction_detail':
        return (
           <TransactionDetail 
             transaction={selectedTransaction}
             onBack={() => handleNavigate('extract')}
             onOpenReceipt={handleOpenReceiptFromDetail}
             user={user}
           />
        );
      case 'settings':
        return (
          <Settings 
            onBack={() => handleNavigate('home')} 
            user={user}
            onUpdateUser={setUser}
          />
        );
      default:
        return <Home onNavigate={handleNavigate} user={user} />;
    }
  };

  const shouldHideBottomNav = ['chat', 'pix', 'pix_amount', 'pix_payment_method', 'pix_review', 'pix_success', 'pix_receipt_detail', 'settings', 'search', 'notifications', 'transaction_detail'].includes(activeTab);
  const shouldHideHeader = ['pix_receipt_detail', 'settings', 'search', 'notifications', 'transaction_detail'].includes(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      {isLoading && <Loader />}
      
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigateToSettings={() => handleNavigate('settings')}
        onLogout={handleLogout}
        user={user} 
      />

      {!shouldHideHeader && (
        <Header 
          user={user}
          showBalance={showBalance}
          toggleBalance={() => setShowBalance(!showBalance)}
          onOpenMenu={() => setIsMenuOpen(true)}
          activeTab={activeTab}
          onNavigate={handleNavigate}
        />
      )}

      <main className="w-full">
        {renderContent()}
      </main>

      {!shouldHideBottomNav && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleNavigate} 
        />
      )}
    </div>
  );
}

export default App;