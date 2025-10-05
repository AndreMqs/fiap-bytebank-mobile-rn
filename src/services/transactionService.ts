import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, TransactionFormData } from '../types/transaction';

export class TransactionService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly TRANSACTIONS_SUBCOLLECTION = 'transactions';

  static async addTransaction(transactionData: TransactionFormData, userId: string): Promise<Transaction> {
    try {
      const transactionWithTimestamps = {
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userTransactionsRef = collection(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION);
      const docRef = await addDoc(userTransactionsRef, transactionWithTimestamps);
      
      const numericValue = parseFloat((transactionData.value || '0').replace(',', '.'));
      
      const newTransaction: Transaction = {
        id: docRef.id,
        type: transactionData.type as 'income' | 'expense',
        value: isNaN(numericValue) ? 0 : numericValue,
        category: transactionData.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
        date: transactionData.date,
        userId,
        createdAt: transactionWithTimestamps.createdAt,
        updatedAt: transactionWithTimestamps.updatedAt,
      };

      return newTransaction;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw new Error('Falha ao salvar transação');
    }
  }

  static async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const userTransactionsRef = collection(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION);
      const q = query(userTransactionsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: data.type,
          value: data.value,
          category: data.category,
          date: data.date,
          userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Falha ao carregar transações');
    }
  }
  static async updateTransaction(transactionId: string, userId: string, transactionData: Partial<TransactionFormData>): Promise<void> {
    try {
      const transactionRef = doc(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION, transactionId);
      const updateData = {
        ...transactionData,
        updatedAt: new Date(),
      };
      
      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error('Falha ao atualizar transação');
    }
  }

  static async deleteTransaction(transactionId: string, userId: string): Promise<void> {
    try {
      const transactionRef = doc(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION, transactionId);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw new Error('Falha ao deletar transação');
    }
  }

  static async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    try {
      const userTransactionsRef = collection(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION);
      const q = query(
        userTransactionsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: data.type,
          value: data.value,
          category: data.category,
          date: data.date,
          userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações por categoria:', error);
      throw new Error('Falha ao carregar transações por categoria');
    }
  }

  static async getTransactionsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Transaction[]> {
    try {
      const userTransactionsRef = collection(db, this.USERS_COLLECTION, userId, this.TRANSACTIONS_SUBCOLLECTION);
      const q = query(
        userTransactionsRef,
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          type: data.type,
          value: data.value,
          category: data.category,
          date: data.date,
          userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações por período:', error);
      throw new Error('Falha ao carregar transações por período');
    }
  }
}
