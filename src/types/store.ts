import { TransactionData } from './transaction';

export interface StoreState {
  user: any | null;
  transactions: TransactionData[];
  isLoading: boolean;
  error: string | null;
  
  fetchUser: () => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (transaction: TransactionData) => void;
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getCategoryData: () => Array<{ name: string; value: number; color: string }>;
} 