import CategoryChart from '@/src/components/CategoryChart/CategoryChart';
import Summary from '@/src/components/Summary/Summary';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserService } from '@/src/services/userService';
import { useStore } from '@/src/store/useStore';
import { User } from '@/src/types/User';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { user: storeUser, fetchUser } = useStore();
  const [userData, setUserData] = useState<User | null>(null);

  // Carregar dados do usuário do Firestore
  useEffect(() => {
    if (user) {
      loadUserData();
      fetchUser();
    }
  }, [user, fetchUser]);

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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header com saudação */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Olá, {userData?.name?.split(' ')[0] || 'Usuário'}! 👋
              </Text>
              <Text style={styles.subtitle}>Bem-vindo ao ByteBank</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/perfil')}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitials}>
                  {userData ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Summary Component */}
        {storeUser && (
          <View style={styles.summaryContainer}>
            <Summary username={storeUser.name} money={storeUser.balance} />
          </View>
        )}


        {/* CategoryChart Component */}
        <View style={styles.chartContainer}>
          <CategoryChart />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileButton: {
    padding: 5,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    margin: 20,
  },
  chartContainer: {
    margin: 20,
  },
});