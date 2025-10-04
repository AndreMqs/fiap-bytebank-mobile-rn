import { User, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { UserDataService } from '../services/userDataService';
import { useStore } from '../store/useStore';
import { UserData } from '../types/User';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearStore } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (!user) {
        clearStore();
      }
    });

    return unsubscribe;
  }, [clearStore]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login realizado com sucesso:', result.user.email);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('Tentando criar usuário com:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário criado com sucesso:', result.user.email);
      
      // Criar dados do usuário no Firestore
      const userData: UserData = {
        uid: result.user.uid,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await UserDataService.createUser(result.user.uid, userData);
      console.log('Dados do usuário salvos no Firestore');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Tentando fazer logout');
      await signOut(auth);
      console.log('Logout realizado com sucesso');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Tentando enviar email de recuperação para:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('Email de recuperação enviado com sucesso');
    } catch (error: any) {
      console.error('Erro no reset de senha:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
