import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserData } from '../types/User';

export class UserDataService {
  private static readonly USERS_COLLECTION = 'users';

  // Criar dados do usuário na nova estrutura
  static async createUser(userId: string, userData: UserData): Promise<void> {
    try {
      // Criar documento do usuário com todos os dados em um só lugar
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await setDoc(userRef, {
        uid: userId,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });

      console.log('Usuário criado com sucesso na nova estrutura');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário');
    }
  }

  // Buscar dados do usuário
  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          uid: userId,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw new Error('Falha ao carregar dados do usuário');
    }
  }

  // Atualizar dados do usuário
  static async updateUserData(userId: string, userData: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
      });

      console.log('Dados do usuário atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw new Error('Falha ao atualizar dados do usuário');
    }
  }

  // Deletar usuário completo (incluindo todas as subcoleções)
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Nota: Para deletar um usuário completamente, você precisaria:
      // 1. Deletar todas as subcoleções (transactions, profile, etc.)
      // 2. Deletar o documento principal do usuário
      // 3. Deletar o usuário da autenticação
      
      // Por enquanto, apenas deletamos o documento principal
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await deleteDoc(userRef);
      
      console.log('Usuário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Falha ao deletar usuário');
    }
  }

  // Verificar se usuário existe
  static async userExists(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('Erro ao verificar existência do usuário:', error);
      return false;
    }
  }
}
