import { TransactionData } from './transaction';

export interface StoreState {
  user: any | null;
  transactions: TransactionData[];
  isLoading: boolean;
  error: string | null;
  
  fetchUser: () => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (transaction: TransactionData) => void;
  updateTransaction: (transactionId: string, userId: string, transactionData: Partial<TransactionData>) => Promise<void>;
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getCategoryData: () => { name: string; value: number; color: string }[];
  getBalance: () => number;
} 