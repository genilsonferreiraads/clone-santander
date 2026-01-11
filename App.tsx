
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
  const [authStep, setAuthStep] = useState<'splash' | 'face_id' | 'password' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const [transferTarget, setTransferTarget] = useState<TransferTarget | null>(null);
  const [transactionAmount, setTransactionAmount] = useState('0,00');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('santander_clone_transactions');
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      return [...parsed, ...INITIAL_TRANSACTIONS];
    }
    return INITIAL_TRANSACTIONS;
  });

  // Dynamic Status Bar Color Logic
  useEffect(() => {
    const SANTANDER_RED = '#EC0000';
    const WHITE = '#FFFFFF';

    let targetColor = SANTANDER_RED;

    // 1. Check Auth Step
    if (authStep === 'face_id' || authStep === 'password') {
      targetColor = WHITE;
    }
    // 2. Check Active Tab (if authenticated)
    else if (authStep === 'app') {
      // List of tabs that have a White header
      const whiteHeaderTabs = ['search', 'notifications', 'pix_receipt_detail'];

      if (whiteHeaderTabs.includes(activeTab)) {
        targetColor = WHITE;
      }
    }
    // Note: SplashScreen (authStep === 'splash') defaults to SANTANDER_RED

    // 3. Update Meta Tag
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", targetColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = "theme-color";
      meta.content = targetColor;
      document.head.appendChild(meta);
    }
  }, [activeTab, authStep]);

  useEffect(() => {
    if (authStep === 'splash') {
      const timer = setTimeout(() => {
        setAuthStep('face_id');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAuthStep('app');
      setIsLoading(false);
    }, 1500);
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

  const handleNavigate = (tab: string) => {
    if (activeTab === tab) return;
    // Navegação instantânea para Home, busca, notificações, configurações 
    // ou se estivermos saindo das configurações
    if (tab === 'home' || tab === 'search' || tab === 'notifications' || tab === 'settings' || activeTab === 'settings') {
      setActiveTab(tab);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateSettings = (updatedUser: User, newTransaction?: Transaction) => {
    setUser(updatedUser);
    localStorage.setItem('santander_clone_user_balance', updatedUser.balance.toString());

    if (newTransaction) {
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);

      const userTransactions = updatedTransactions.filter(t => !['t1', 't2', 't3', 't4', 't5'].includes(t.id));
      localStorage.setItem('santander_clone_transactions', JSON.stringify(userTransactions));
    }
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

    // Start slow loading animation for 2 seconds as requested
    setIsLoading(true);
    setIsSlowLoading(true);

    setTimeout(() => {
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
          date: new Date().toISOString(),
          target: transferTarget || undefined
        };

        const updatedTransactions = [newTx, ...transactions];
        setTransactions(updatedTransactions);

        const userTransactions = updatedTransactions.filter(t => !['t1', 't2', 't3', 't4', 't5'].includes(t.id));
        localStorage.setItem('santander_clone_transactions', JSON.stringify(userTransactions));
      }

      setActiveTab('pix_success');
      setIsLoading(false);
      setIsSlowLoading(false);
    }, 2000);
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

  if (authStep === 'splash') return <SplashScreen />;
  if (authStep === 'face_id') return <LoginFaceId user={user} onLogin={handleLoginSuccess} onSwitchToPassword={() => setAuthStep('password')} />;
  if (authStep === 'password') return <LoginPassword user={user} onLogin={handleLoginSuccess} onSwitchToFaceId={() => setAuthStep('face_id')} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={handleNavigate} user={user} />;
      case 'search': return <Search onBack={() => handleNavigate('home')} onNavigateToChat={() => handleNavigate('chat')} />;
      case 'notifications': return <Notifications onBack={() => handleNavigate('home')} />;
      case 'extract': return <Extract user={user} transactions={transactions} onTransactionClick={handleTransactionClick} />;
      case 'chat': return <Chat />;
      case 'pix': return <PixArea onNavigateToAmount={handleNavigateToAmount} />;
      case 'pix_amount': return <PixAmount target={transferTarget} onContinue={handleAmountContinue} />;
      case 'pix_payment_method': return <PixPaymentMethod onContinue={() => handleNavigate('pix_review')} user={user} />;
      case 'pix_review': return <PixReview target={transferTarget} amount={transactionAmount} onConfirm={handleConfirmTransaction} />;
      case 'pix_success': return <PixSuccess target={transferTarget} amount={transactionAmount} onShowReceipt={() => handleNavigate('pix_receipt_detail')} onNewPix={() => handleNavigate('pix')} user={user} />;
      case 'pix_receipt_detail': return <PixReceiptDetail target={transferTarget} amount={transactionAmount} onClose={() => handleNavigate(selectedTransaction ? 'transaction_detail' : 'pix_success')} user={user} />;
      case 'transaction_detail': return <TransactionDetail transaction={selectedTransaction} onBack={() => handleNavigate('extract')} onOpenReceipt={handleOpenReceiptFromDetail} user={user} />;
      case 'settings': return <Settings onBack={() => handleNavigate('home')} user={user} onUpdateUser={handleUpdateSettings} onRedirectToPix={() => handleNavigate('pix')} />;
      default: return <Home onNavigate={handleNavigate} user={user} />;
    }
  };

  const shouldHideBottomNav = ['chat', 'pix', 'pix_amount', 'pix_payment_method', 'pix_review', 'pix_success', 'pix_receipt_detail', 'settings', 'search', 'notifications', 'transaction_detail'].includes(activeTab);
  const shouldHideHeader = ['pix_receipt_detail', 'settings', 'search', 'notifications', 'transaction_detail'].includes(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      {isLoading && <Loader slow={isSlowLoading} />}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigateToSettings={() => handleNavigate('settings')} onLogout={handleLogout} user={user} />
      {!shouldHideHeader && <Header user={user} showBalance={showBalance} toggleBalance={() => setShowBalance(!showBalance)} onOpenMenu={() => setIsMenuOpen(true)} activeTab={activeTab} onNavigate={handleNavigate} />}
      <main className="w-full">{renderContent()}</main>
      {!shouldHideBottomNav && <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />}
    </div>
  );
}

export default App;
