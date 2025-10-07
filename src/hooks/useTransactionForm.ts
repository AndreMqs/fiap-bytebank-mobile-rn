import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionService } from '../services/transactionService';
import { useStore } from '../store/useStore';
import { CSVTransaction, TransactionData, TransactionFormData } from '../types/transaction';

export const useTransactionForm = () => {
  const { addTransaction } = useStore();
  const { user } = useAuth();
  
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<TransactionFormData>({
    type: '',
    category: '',
    value: '',
    date: getCurrentDate()
  });
  
  const [isFocused, setIsFocused] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('manual');
  const [csvTransactions, setCsvTransactions] = useState<CSVTransaction[]>([]);
  const [valueError, setValueError] = useState<string>('');

  const updateFormField = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData({
      type: '',
      category: '',
      value: '',
      date: getCurrentDate()
    });
    setValueError('');
  };

  const clearCSV = () => {
    setCsvTransactions([]);
  };

  const addTransactionWithFirebase = async (transactionData: TransactionData) => {
    try {
      if (user?.uid) {
        const firebaseTransactionData: TransactionFormData = {
          type: transactionData.type,
          category: transactionData.category,
          value: transactionData.value.toString(),
          date: transactionData.date
        };
        
        const savedTransaction = await TransactionService.addTransaction(firebaseTransactionData, user.uid);
        addTransaction(savedTransaction);
      } else {
        addTransaction(transactionData);
      }
    } catch (error) {
      console.error('Erro ao salvar transação no Firebase:', error);
      addTransaction(transactionData);
    }
  };

  return {
    formData,
    isFocused,
    inputMode,
    csvTransactions,
    valueError,
    updateFormField,
    setIsFocused,
    setInputMode,
    setCsvTransactions,
    setValueError,
    clearForm,
    clearCSV,
    addTransaction: addTransactionWithFirebase
  };
}; 