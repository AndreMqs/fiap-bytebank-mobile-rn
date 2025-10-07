import { create } from 'zustand';
import { TransactionService } from '../services/transactionService';
import { StoreState } from '../types/store';
import { TransactionData, UpdateTransactionRequest } from '../types/transaction';

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ error: 'Erro ao carregar dados do usuário', isLoading: false });
    }
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
    set(state => ({
      transactions: [transactionData, ...state.transactions],
    }));
  },

  updateTransaction: async (transactionId: string, userId: string, transactionData: Partial<TransactionData>) => {
    if (!transactionId || typeof transactionId !== 'string' || transactionId.trim() === '') {
      set({ 
        error: 'ID da transação é obrigatório e deve ser uma string válida', 
        isLoading: false 
      });
      return;
    }
    
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      set({ 
        error: 'ID do usuário é obrigatório e deve ser uma string válida', 
        isLoading: false 
      });
      return;
    }

    if (!transactionData || Object.keys(transactionData).length === 0) {
      set({ 
        error: 'Dados para atualização são obrigatórios', 
        isLoading: false 
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const updateRequest: UpdateTransactionRequest = {
        id: transactionId,
        userId: userId,
        data: {
          value: transactionData.value,
          type: transactionData.type,
          category: transactionData.category,
          date: transactionData.date,
        }
      };

      const response = await TransactionService.updateTransaction(updateRequest);

      if (!response.success) {
        set({ 
          error: response.error || 'Erro ao atualizar transação', 
          isLoading: false 
        });
        return;
      }

      set(state => ({
        transactions: state.transactions.map(t => 
          t.id === transactionId 
            ? { ...t, ...transactionData, updatedAt: new Date() }
            : t
        ),
        isLoading: false,
        error: null
      }));

    } catch (error) {
      console.error('❌ [useStore] Error updating transaction:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar transação', 
        isLoading: false 
      });
    }
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
      .reduce((sum, t) => sum + (+t.value), 0);
  },

  getTotalExpense: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (+t.value), 0);
  },

  getBalance: () => {
    const { transactions } = get();
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        return acc + (+curr.value);
      }

      if (curr.type === 'expense') {
        return acc - (+curr.value);
      }

      return acc;
    }, 0);
  },

  getCategoryData: () => {
    const { transactions } = get();
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + (+transaction.value));
      });

    const colors = ['#2196F3', '#9C27B0', '#E91E63', '#FF9800', '#4CAF50'];
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  },


  clearStore: () => {
    set({
      user: null,
      transactions: [],
      isLoading: false,
      error: null,
    });
  },
})); 