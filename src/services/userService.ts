import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, UserData } from '../types/User';

export class UserService {
  static async createUser(userId: string, userData: UserData): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, userData);
      console.log('Usuário criado no Firestore:', userId);
    } catch (error) {
      console.error('Erro ao criar usuário no Firestore:', error);
      throw error;
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userId,
          uid: data.uid || userId,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
      });
      console.log('Usuário atualizado no Firestore:', userId);
    } catch (error) {
      console.error('Erro ao atualizar usuário no Firestore:', error);
      throw error;
    }
  }
}
