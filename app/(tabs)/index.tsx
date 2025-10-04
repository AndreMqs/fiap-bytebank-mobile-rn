import CategoryChart from '@/src/components/CategoryChart/CategoryChart';
import Summary from '@/src/components/Summary/Summary';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserDataService } from '@/src/services/userDataService';
import { useStore } from '@/src/store/useStore';
import { User } from '@/src/types/User';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONTENT_MAX = 840;

export default function HomeScreen() {
  const { user } = useAuth();
  const { user: storeUser, fetchUser } = useStore();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const info = await UserDataService.getUserData(user.uid);
          setUserData(info);
        } catch (e) {
          console.error('Erro ao carregar dados do usuário:', e);
        }
      })();
      fetchUser();
    }
  }, [user, fetchUser]);

  const displayUser = useMemo(() => storeUser ?? userData ?? null, [storeUser, userData]);
  const firstName = useMemo(
    () => (displayUser?.name ? displayUser.name.split(' ')[0] : 'Usuário'),
    [displayUser?.name]
  );
  const initials = useMemo(
    () =>
      displayUser?.name
        ? displayUser.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'U',
    [displayUser?.name]
  );
  const balance = displayUser?.balance ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient colors={['#004D61', '#E4EDE3']} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Olá, {firstName}! 👋</Text>
              <Text style={styles.subtitle}>Bem-vindo ao ByteBank</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/perfil')}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitials}>{initials}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.sectionMax}>
          <View style={styles.cardGap}>
            <Summary username={displayUser?.name ?? 'Usuário'} money={balance} />
          </View>

          <View style={styles.cardGap}>
            <CategoryChart />
          </View>
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
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 24,
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
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  profileButton: { padding: 5 },
  profileAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  profileInitials: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  sectionMax: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cardGap: {
    marginBottom: 20,
  },
});
