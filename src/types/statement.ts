import { TransactionData } from "./transaction";

export interface Statement {
  type: string;
  date: Date;
  moneyValue: number;
}

export interface FilterCriteria {
  category: string;
  dateFrom: string;
  dateTo: string;
  valueMin: string;
  valueMax: string;
  type: string;
}

export interface StatementProps {
  transactions: TransactionData[];
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  updateTransaction?: (id: string, userId: string, transactionData: Partial<TransactionData>) => Promise<void>;
  userId?: string;
}

export interface SingleStatementProps {
  transaction: TransactionData;
  isEditing: boolean;
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  updateTransaction?: (id: string, userId: string, transactionData: Partial<TransactionData>) => Promise<void>;
  userId?: string;
}

export interface StatementListProps {
  statementsByMonth: Map<string, TransactionData[]>;
  isEditing: boolean;
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  updateTransaction?: (id: string, userId: string, transactionData: Partial<TransactionData>) => Promise<void>;
  userId?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterCriteria) => void;
  currentFilters: FilterCriteria;
} 