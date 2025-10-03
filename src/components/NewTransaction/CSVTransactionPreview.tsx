import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CSVTransactionPreviewProps } from '../../types/components';

export const CSVTransactionPreview = ({ transactions, onClear }: CSVTransactionPreviewProps) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { 
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true 
      }),
      Animated.timing(slideUp, { 
        toValue: 0, 
        duration: 300, 
        useNativeDriver: true 
      })
    ]).start();
  }, [fade, slideUp]);

  if (transactions.length === 0) return null;

  const handleClear = () => {
    Alert.alert(
      'Limpar CSV',
      'Tem certeza que deseja limpar todas as transações carregadas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: onClear,
        },
      ]
    );
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.csvPreview, 
        { 
          opacity: fade,
          transform: [{ translateY: slideUp }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.h4}>
          📄 Transações carregadas ({transactions.length})
        </Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {transactions.map((transaction, index) => (
          <Animated.View
            key={`${transaction.date}-${index}`}
            style={[
              styles.transactionPreview,
              transaction.type === 'income' ? styles.incomeBorder : styles.expenseBorder,
            ]}
          >
            <View style={styles.transactionInfo}>
              <View style={styles.typeContainer}>
                <Text style={styles.type}>
                  {transaction.type === 'income' ? '📈 Receita' : '📉 Despesa'}
                </Text>
                <Text style={styles.category}>{transaction.category}</Text>
              </View>
              <Text style={styles.date}>{formatDate(transaction.date)}</Text>
            </View>
            <Text
              style={[
                styles.value,
                transaction.type === 'income' ? styles.valueIncome : styles.valueExpense,
              ]}
            >
              {formatValue(transaction.value)}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Toque em &quot;Concluir&quot; para salvar no Firebase
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  csvPreview: {
    width: '100%',
    maxHeight: Platform.OS === 'ios' ? 350 : 320,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 77, 97, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  h4: {
    color: '#004D61',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scroll: {
    maxHeight: Platform.OS === 'ios' ? 240 : 220,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  transactionPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  incomeBorder: {
    borderLeftColor: '#4caf50',
  },
  expenseBorder: {
    borderLeftColor: '#f44336',
  },
  transactionInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  type: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  date: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  value: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'right',
  },
  valueIncome: {
    color: '#4caf50',
  },
  valueExpense: {
    color: '#f44336',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 77, 97, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
