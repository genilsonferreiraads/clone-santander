import { Transaction, User, QuickAction } from './types';

export const USER_DATA: User = {
  name: "Genilson Ferreira Dos Santos",
  balance: 860.20,
  limit: 1660.20
};

export const TRANSACTIONS: Transaction[] = [
  // Hoje (Assumed 2025-12-09 based on context of next date being Dec 8)
  { id: 't1', type: 'pix_sent', description: 'Pix enviado\nGenilson ferreira dos san', amount: -2.00, date: '2025-12-09' },
  { id: 't2', type: 'salary', description: 'Pagamento de 13 salarios\nCnpj 009306339000195', amount: 1404.15, date: '2025-12-09' },
  
  // segunda, 8 de dezembro
  { id: 't3', type: 'salary', description: 'Remuneracao aplicacao automatica', amount: 0.01, date: '2025-12-08' },
  { id: 't4', type: 'pix_sent', description: 'Pix enviado\nHigina carolina gomes de', amount: -42.59, date: '2025-12-08' },
  { id: 't5', type: 'payment', description: 'Pagamento cartao credito bce', amount: -50.00, date: '2025-12-08' }, // Amount estimated or placeholder
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'pix', label: 'Pix', iconName: 'pix' },
  { id: 'emprestimos', label: 'Empréstimos', iconName: 'loans' },
  { id: 'dindin', label: 'DinDin', iconName: 'dindin' },
  { id: 'pagar', label: 'Pagar', iconName: 'barcode' },
  { id: 'transferir', label: 'Transferir', iconName: 'arrow-right-left' },
  { id: 'recarga', label: 'Recarga', iconName: 'smartphone' },
];