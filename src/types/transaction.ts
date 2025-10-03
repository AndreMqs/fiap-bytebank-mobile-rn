export interface CSVTransaction {
  type: string;
  value: number;
  category: string;
  date: string;
}

export interface TransactionData {
  type: 'income' | 'expense';
  value: number;
  category: 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte';
  date: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  value: number;
  category: 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte';
  date: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  type: string;
  category: string;
  value: string;
  date: string;
} 