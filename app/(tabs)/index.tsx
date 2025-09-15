import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserService } from '@/src/services/userService';
import { User } from '@/src/types/User';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  // Carregar dados do usuário do Firestore
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



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header com saudação */}
        <View style={styles.header}>
          {userData ? (
            <ThemedText style={styles.greeting}>
              Olá, {userData.name}! 👋
            </ThemedText>
          ) : (
            <ThemedText style={styles.greeting}>
              Olá! 👋
            </ThemedText>
          )}
        </View>

        {/* Conteúdo principal */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>Home</ThemedText>
          <ThemedText style={styles.subtitle}>
            Bem-vindo ao ByteBank Mobile
          </ThemedText>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
