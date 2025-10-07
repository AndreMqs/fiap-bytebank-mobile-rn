import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Delete from '../../../images/Delete.svg';
import { SingleStatementProps } from '../../../types/statement';
import { parseMoneyValue } from '../../../utils/stringUtils';

export default function SingleStatement(props: SingleStatementProps) {
  const { transaction, isEditing, deleteTransaction, updateTransaction, userId } = props;
  const { type, date, value, category } = transaction;
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDelete = () => {
    deleteTransaction(transaction.id, userId ?? '');
  };

  const handleSaveEdit = async () => {
    if (!transaction) {
      console.error('❌ [SingleStatement] Transaction object is missing');
      return;
    }

    if (!transaction.id || typeof transaction.id !== 'string' || transaction.id.trim() === '') {
      console.error('❌ [SingleStatement] Transaction ID is missing or invalid:', transaction.id);
      return;
    }
    
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      console.error('❌ [SingleStatement] User ID is missing or invalid:', userId);
      return;
    }
    
    if (!updateTransaction || typeof updateTransaction !== 'function') {
      console.error('❌ [SingleStatement] Update transaction function is missing or invalid');
      return;
    }

    const cleanValue = (inputValue || '').replace(',', '.');
    const numericValue = parseFloat(cleanValue);
    
    if (isNaN(numericValue)) {
      console.error('❌ [SingleStatement] Invalid numeric value:', inputValue);
      return;
    }

    if (numericValue < 0) {
      console.error('❌ [SingleStatement] Value cannot be negative:', numericValue);
      return;
    }

    if (numericValue === value) {
      return;
    }

    try {
      const transactionData = { value: numericValue };
      await updateTransaction(transaction.id, userId, transactionData);
    } catch (error) {
      console.error('❌ [SingleStatement] Error updating transaction:', error);
    }
  };

  const getInputValue = () => {
    if (isEditing && isFocused) {
      return inputValue || '';
    }
    
    const num = parseFloat(inputValue || '0');
    if (Number.isNaN(num)) return parseMoneyValue(0);
    
    const formattedValue = parseMoneyValue(num);
    return type === 'expense' ? `- ${formattedValue}` : formattedValue;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const fade = useRef(new Animated.Value(0)).current;
  const scaleDelete = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const pressIn = () => Animated.spring(scaleDelete, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scaleDelete, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.singleStatementContainer, { opacity: fade }]}>
      <View style={styles.leftColumn}>
        <Text style={styles.type}>{type === 'income' ? 'Receita' : 'Despesa'}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>{category}</Text>
        </View>
        <TextInput
          style={[styles.inputMoney, type === 'expense' && styles.expenseValue]}
          value={getInputValue()}
          onChangeText={setInputValue}
          editable={isEditing}
          onBlur={() => {
            setIsFocused(false);
            if (isEditing) {
              handleSaveEdit();
            }
          }}
          onFocus={() => setIsFocused(true)}
          keyboardType="decimal-pad"
        />
      </View>

      {isEditing && (
        <Animated.View style={[styles.deleteWrapper, { transform: [{ scale: scaleDelete }] }]}>
          <Pressable
            onPress={handleDelete}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.deleteButton}
            accessibilityLabel="Deletar transação"
          >
            <Delete width={16} height={16} />
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  singleStatementContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#47A138',
    paddingBottom: 8,
  },
  leftColumn: {
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.36,
    color: '#000000',
    textAlign: 'left',
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 15.73,
    color: '#8B8B8B',
    textAlign: 'left',
  },
  rightColumn: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-end',
    flex: 1,
  },
  categoryChip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  categoryChipText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  inputMoney: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19.36,
    textAlign: 'right',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    width: '100%',
    maxWidth: 120,
  },
  expenseValue: {
    color: '#D32F2F',
  },
  deleteWrapper: {
    position: 'absolute',
    top: 0,
    right: -30,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
});
