import { ThemedText } from '@/components/themed-text';
import EmptyState from '@/src/components/Statement/EmptyState/EmptyState';
import Statement from '@/src/components/Statement/Statement';
import { useUserTransactions } from '@/src/hooks/useUserTransactions';
import { useStore } from '@/src/store/useStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExtratoScreen() {
  const { transactions, userId, isLoading, error } = useUserTransactions();
  const { deleteTransaction, updateTransaction } = useStore();



  const handleDeleteTransaction = async (id: string) => {
    if (!userId) return;
    
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id, userId);
              Alert.alert('Sucesso', 'Transação excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a transação.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateTransaction = async (id: string, userId: string, transactionData: any) => {
    try {
      await updateTransaction(id, userId, transactionData);
      Alert.alert('Sucesso', 'Transação atualizada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a transação.');
    }
  };

  const renderContent = () => {
    if (isLoading && transactions.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#004D61" />
          <ThemedText style={styles.loadingText}>Carregando transações...</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ Erro ao carregar transações</ThemedText>
          <ThemedText style={styles.errorSubtext}>{error}</ThemedText>
        </View>
      );
    }

    if (transactions.length === 0) {
      return (
        <EmptyState
          title="Nenhuma transação encontrada"
          subtitle="Seu extrato está vazio. Comece adicionando suas primeiras transações para acompanhar suas movimentações financeiras."
          icon="📊"
        />
      );
    }

    return (
      <Statement 
        transactions={transactions} 
        deleteTransaction={handleDeleteTransaction}
        updateTransaction={handleUpdateTransaction}
        userId={userId}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#004D61', '#E4EDE3']}
          style={styles.header}
        >
          <ThemedText style={styles.title}>Extrato</ThemedText>
          <ThemedText style={styles.subtitle}>
            {transactions.length > 0 
              ? `${transactions.length} transação${transactions.length !== 1 ? 'ões' : ''} encontrada${transactions.length !== 1 ? 's' : ''}`
              : 'Consulte suas movimentações financeiras'
            }
          </ThemedText>
        </LinearGradient>

        {/* Content */}
        <View style={styles.statementContainer}>
          {renderContent()}
        </View>
      </View>
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
    minHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});