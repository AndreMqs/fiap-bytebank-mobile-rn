import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../src/components/themed-text';
import { useAuth } from '../src/contexts/AuthContext';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#004D61', '#E4EDE3']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
            <ThemedText style={styles.title}>Perfil</ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName ? getInitials(user.displayName) : 'U'}
              </Text>
            </View>
            <ThemedText style={styles.userName}>
              {user?.displayName || 'Usuário'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>
              {user?.email || 'email@exemplo.com'}
            </ThemedText>
          </View>

          <View style={styles.optionsContainer}>
          

            <TouchableOpacity style={styles.optionButton} onPress={handlePoliticaPrivacidade}>
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🔒</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Política de Privacidade</Text>
                  <Text style={styles.optionSubtitle}>Termos e condições</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleSair}>
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🚪</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, styles.logoutText]}>Sair da Conta</Text>
                  <Text style={styles.optionSubtitle}>Fazer logout do aplicativo</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderRadius: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
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