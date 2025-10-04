import { ThemedText } from '@/src/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewTransaction from '../../src/components/NewTransaction/NewTransaction';

export default function TransferenciasScreen() {
  const [transactionsCount, setTransactionsCount] = useState(0);

  const handleTransactionAdded = () => {
    setTransactionsCount(prev => prev + 1);
    Alert.alert(
      'Sucesso!',
      'Transação adicionada com sucesso!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <LinearGradient
          colors={['#004D61', '#E4EDE3']}
          style={styles.header}
        >
          <ThemedText style={styles.title}>Transferir</ThemedText>
          <ThemedText style={styles.subtitle}>
            {transactionsCount > 0 
              ? `${transactionsCount} transação${transactionsCount !== 1 ? 'ões' : ''} adicionada${transactionsCount !== 1 ? 's' : ''} nesta sessão`
              : 'Adicione suas movimentações financeiras'
            }
          </ThemedText>
        </LinearGradient>

        {/* Content */}
        <View style={styles.container}>
          <NewTransaction onTransactionAdded={handleTransactionAdded} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
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
  container: {
    flex: 1,
    padding: 20,
    minHeight: '100%',
  },
});