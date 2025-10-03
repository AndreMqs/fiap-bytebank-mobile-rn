import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';

export const useUserTransactions = () => {
  const { user } = useAuth();
  const { transactions, fetchTransactions, isLoading, error } = useStore();

  // Carregar transações do usuário quando ele estiver autenticado
  useEffect(() => {
    if (user?.uid) {
      fetchTransactions(user.uid);
    }
  }, [user?.uid, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    userId: user?.uid,
  };
};
