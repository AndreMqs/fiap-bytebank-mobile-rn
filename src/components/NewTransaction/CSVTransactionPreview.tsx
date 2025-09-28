import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CSVTransactionPreviewProps } from '../../types/components';

export const CSVTransactionPreview = ({ transactions, onClear }: CSVTransactionPreviewProps) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  if (transactions.length === 0) return null;

  return (
    <Animated.View style={[styles.csvPreview, { opacity: fade }]}>
      <Text style={styles.h4}>Transações carregadas ({transactions.length}):</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {transactions.map((transaction, index) => (
          <View
            key={index}
            style={[
              styles.transactionPreview,
              transaction.type === 'income' ? styles.incomeBorder : styles.expenseBorder,
            ]}
          >
            <View style={styles.transactionInfo}>
              <Text style={styles.type}>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</Text>
              <Text style={styles.category}>{transaction.category}</Text>
              <Text style={styles.date}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.value,
                transaction.type === 'income' ? styles.valueIncome : styles.valueExpense,
              ]}
            >
              R$ {transaction.value.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  csvPreview: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  h4: {
    color: '#DEE9EA',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  scroll: {
    maxHeight: 260,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  transactionPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    borderLeftWidth: 4,
  },
  incomeBorder: {
    borderLeftColor: '#4caf50',
  },
  expenseBorder: {
    borderLeftColor: '#f44336',
  },
  transactionInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  type: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  value: {
    fontWeight: '600',
    fontSize: 14,
  },
  valueIncome: {
    color: '#4caf50',
  },
  valueExpense: {
    color: '#f44336',
  },
});
