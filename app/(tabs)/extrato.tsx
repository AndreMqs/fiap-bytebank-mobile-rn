import { ThemedText } from '@/components/themed-text';
import Statement from '@/src/components/Statement/Statement';
import { useUserTransactions } from '@/src/hooks/useUserTransactions';
import { useStore } from '@/src/store/useStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExtratoScreen() {
  const { transactions, userId } = useUserTransactions();
  const { deleteTransaction } = useStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <ThemedText style={styles.title}>Extrato</ThemedText>
          <ThemedText style={styles.subtitle}>
            Consulte suas movimentações financeiras
          </ThemedText>
        </LinearGradient>

        {/* Statement Component */}
        <View style={styles.statementContainer}>
          <Statement 
            transactions={transactions} 
            deleteTransaction={(id) => userId && deleteTransaction(id, userId)} 
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statementContainer: {
    margin: 20,
    alignItems: 'center',
  },
});