import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewTransaction from '../../src/components/NewTransaction/NewTransaction';

export default function TransferenciasScreen() {
  const handleTransactionAdded = () => {
    console.log('Transação adicionada com sucesso!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <NewTransaction onTransactionAdded={handleTransactionAdded} />
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
    padding: 20,
  },
});