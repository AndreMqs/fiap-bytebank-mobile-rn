import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewTransaction from '../../src/components/NewTransaction/NewTransaction';

export default function TransferenciasScreen() {
  const handleTransactionAdded = () => {
    console.log('Transação adicionada com sucesso!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
    paddingBottom: 40, // Espaço extra para os botões
  },
  container: {
    flex: 1,
    padding: 20,
    minHeight: '100%', // Garante altura mínima
  },
});