import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, TransactionFormData, UpdateTransactionRequest, UpdateTransactionResponse } from '../types/transaction';

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
  static async updateTransaction(request: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
    try {
      if (!request.id || typeof request.id !== 'string' || request.id.trim() === '') {
        return {
          success: false,
          error: 'ID da transação é obrigatório e deve ser uma string válida'
        };
      }
      
      if (!request.userId || typeof request.userId !== 'string' || request.userId.trim() === '') {
        return {
          success: false,
          error: 'ID do usuário é obrigatório e deve ser uma string válida'
        };
      }

      if (!request.data || Object.keys(request.data).length === 0) {
        return {
          success: false,
          error: 'Dados para atualização são obrigatórios'
        };
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (request.data.value !== undefined) {
        if (typeof request.data.value !== 'number' || request.data.value < 0) {
          return {
            success: false,
            error: 'Valor deve ser um número positivo'
          };
        }
        updateData.value = request.data.value.toString();
      }

      if (request.data.type !== undefined) {
        if (!['income', 'expense'].includes(request.data.type)) {
          return {
            success: false,
            error: 'Tipo deve ser "income" ou "expense"'
          };
        }
        updateData.type = request.data.type;
      }

      if (request.data.category !== undefined) {
        const validCategories = ['Alimentação', 'Moradia', 'Saúde', 'Estudo', 'Transporte'];
        if (!validCategories.includes(request.data.category)) {
          return {
            success: false,
            error: `Categoria deve ser uma das seguintes: ${validCategories.join(', ')}`
          };
        }
        updateData.category = request.data.category;
      }

      if (request.data.date !== undefined) {
        if (typeof request.data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(request.data.date)) {
          return {
            success: false,
            error: 'Data deve estar no formato YYYY-MM-DD'
          };
        }
        updateData.date = request.data.date;
      }

      const transactionRef = doc(db, this.USERS_COLLECTION, request.userId, this.TRANSACTIONS_SUBCOLLECTION, request.id);
      await updateDoc(transactionRef, updateData);

      return {
        success: true,
        transaction: {
          id: request.id,
          type: request.data.type || 'income',
          value: request.data.value || 0,
          category: request.data.category || 'Alimentação',
          date: request.data.date || new Date().toISOString().split('T')[0],
        } as Transaction
      };

    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao atualizar transação'
      };
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
