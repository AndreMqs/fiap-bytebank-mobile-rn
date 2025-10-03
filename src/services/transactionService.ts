import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, TransactionFormData } from '../types/transaction';

export class TransactionService {
  private static readonly COLLECTION_NAME = 'transactions';

  // Adicionar uma nova transação
  static async addTransaction(transactionData: TransactionFormData, userId: string): Promise<Transaction> {
    try {
      const transactionWithUser = {
        ...transactionData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), transactionWithUser);
      
      const numericValue = parseFloat(transactionData.value.replace(',', '.'));
      
      const newTransaction: Transaction = {
        id: docRef.id,
        type: transactionData.type as 'income' | 'expense',
        value: isNaN(numericValue) ? 0 : numericValue,
        category: transactionData.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
        date: transactionData.date,
        userId,
        createdAt: transactionWithUser.createdAt,
        updatedAt: transactionWithUser.updatedAt,
      };

      return newTransaction;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw new Error('Falha ao salvar transação');
    }
  }

  // Buscar transações do usuário
  static async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
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
          userId: data.userId,
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

  // Deletar transação
  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, transactionId));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw new Error('Falha ao deletar transação');
    }
  }

  // Buscar transações por categoria
  static async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
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
          userId: data.userId,
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

  // Buscar transações por período
  static async getTransactionsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
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
          userId: data.userId,
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
