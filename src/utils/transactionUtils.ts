import { CSVTransaction, TransactionData } from '../types/transaction';

export const createTransactionFromForm = (
  type: string,
  category: string,
  value: string,
  date: string
): TransactionData => {
  const numericValue = parseFloat((value || '0').replace(',', '.'));
  
  return {
    type: type === 'Receita' ? 'income' : 'expense',
    value: numericValue,
    category: category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
    date: date,
  };
};

export const createTransactionsFromCSV = (transactions: CSVTransaction[]): TransactionData[] => {
  return transactions.map(transaction => ({
    type: transaction.type === 'income' || transaction.type === 'Receita' ? 'income' : 'expense',
    value: transaction.value,
    category: transaction.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
    date: transaction.date,
  }));
};

export const getButtonText = (isMobile: boolean, inputMode: 'manual' | 'csv', csvCount: number) => {
  if (inputMode === 'csv') {
    return 'Adicionar';
  }
  
  return isMobile ? 'Concluir' : 'Concluir transação';
};

export const isFormValid = (
  inputMode: 'manual' | 'csv',
  formData: { type: string; category: string; value: string; date: string },
  valueError: string,
  csvTransactions: CSVTransaction[]
) => {
  if (inputMode === 'manual') {
    return !!(formData.type && formData.category && formData.value && formData.date) && !valueError;
  }
  
  return csvTransactions.length > 0;
}; 