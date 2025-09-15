import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserService } from '@/src/services/userService';
import { User } from '@/src/types/User';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (user) {
      try {
        const userInfo = await UserService.getUser(user.uid);
        setUserData(userInfo);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMeusDados = () => {
    router.push('/meus-dados');
  };

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            // Implementar exclusão da conta
            Alert.alert('Em desenvolvimento', 'Funcionalidade em desenvolvimento');
          }
        }
      ]
    );
  };

  const handlePoliticaPrivacidade = () => {
    Alert.alert('Política de Privacidade', 'Funcionalidade em desenvolvimento');
  };

  const handleSair = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Perfil</ThemedText>
        </View>
      
      <View style={styles.content}>
        {/* Avatar com iniciais */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {userData ? getInitials(userData.name) : 'U'}
            </ThemedText>
          </View>
          <ThemedText style={styles.userName}>
            {userData?.name || 'Usuário'}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {userData?.email || 'email@exemplo.com'}
          </ThemedText>
        </View>

        {/* Lista de opções */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleMeusDados}>
            <ThemedText style={styles.optionText}>Meus Dados</ThemedText>
            <ThemedText style={styles.optionArrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handlePoliticaPrivacidade}>
            <ThemedText style={styles.optionText}>Política de Privacidade</ThemedText>
            <ThemedText style={styles.optionArrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleExcluirConta}>
            <ThemedText style={[styles.optionText, styles.dangerText]}>Excluir Conta</ThemedText>
            <ThemedText style={styles.optionArrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleSair}>
            <ThemedText style={[styles.optionText, styles.logoutText]}>Sair da Conta</ThemedText>
            <ThemedText style={styles.optionArrow}>›</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  dangerText: {
    color: '#ff4444',
  },
  logoutText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  optionArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
});
