
export interface Transaction {
  id: string;
  type: 'pix_sent' | 'pix_received' | 'salary' | 'payment' | 'credit_card';
  description: string;
  amount: number;
  date: string; // ISO date string YYYY-MM-DD
  target?: TransferTarget; // Optional: Store who received the money
}

export interface QuickAction {
  id: string;
  label: string;
  iconName: string;
}

export interface User {
  name: string;
  balance: number;
  limit: number;
}

export interface TransferTarget {
  name: string;
  cpf: string;
  bank?: string;
  key?: string;
}