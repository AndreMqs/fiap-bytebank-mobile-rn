import { create } from 'zustand';
import { TransactionService } from '../services/transactionService';
import { StoreState } from '../types/store';
import { TransactionData } from '../types/transaction';

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    // Esta função será implementada se necessário
    console.log('fetchUser not implemented yet');
  },

  fetchTransactions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await TransactionService.getTransactions(userId);
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ error: 'Erro ao carregar transações', isLoading: false });
    }
  },

  addTransaction: (transactionData: TransactionData) => {
    // Adiciona apenas ao store local (Firebase é tratado no hook)
    set(state => ({
      transactions: [transactionData, ...state.transactions],
    }));
  },

  deleteTransaction: async (transactionId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await TransactionService.deleteTransaction(transactionId, userId);
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== transactionId),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      set({ error: 'Erro ao deletar transação', isLoading: false });
    }
  },

  getTotalIncome: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
  },

  getTotalExpense: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
  },

  getCategoryData: () => {
    const { transactions } = get();
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.value);
    });

    const colors = ['#2196F3', '#9C27B0', '#E91E63', '#FF9800', '#4CAF50'];
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  },
})); 