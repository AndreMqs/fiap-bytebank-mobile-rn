import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useTransactionForm } from '../../hooks/useTransactionForm';
import { NewTransactionProps } from '../../types/components';
import { CSVTransaction } from '../../types/transaction';
import { createTransactionFromForm, createTransactionsFromCSV, getButtonText, isFormValid } from '../../utils/transactionUtils';
import { useValueValidation } from '../../utils/valueValidationUtils';
import CSVUpload from '../CSVUpload/CSVUpload';
import { CSVTransactionPreview } from './CSVTransactionPreview';
import { ManualTransactionForm } from './ManualTransactionForm';
import { ModeSelector } from './ModeSelector';

import TransactionBackground from '../../images/TransactionBackground.svg';

export default function NewTransaction({ onTransactionAdded, className = '', disabled = false }: NewTransactionProps) {
  const {
    formData,
    isFocused,
    inputMode,
    csvTransactions,
    valueError,
    updateFormField,
    setIsFocused,
    setInputMode,
    setCsvTransactions,
    setValueError,
    clearForm,
    clearCSV,
    addTransaction,
  } = useTransactionForm();

  const { validateValue, filterInvalidCharacters } = useValueValidation();

  const { width } = useWindowDimensions();
  const isMobile = width <= 425;

  const fade = useRef(new Animated.Value(0)).current;
  const scaleFinish = useRef(new Animated.Value(1)).current;
  const scaleClear = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const handleFinishTransaction = () => {
    if (inputMode === 'manual') {
      const transaction = createTransactionFromForm(formData.type, formData.category, formData.value, formData.date);
      addTransaction(transaction);
      clearForm();
      onTransactionAdded?.();
    } else if (inputMode === 'csv' && csvTransactions.length > 0) {
      const transactions = createTransactionsFromCSV(csvTransactions);
      transactions.forEach(addTransaction);
      clearCSV();
      setInputMode('manual');
      onTransactionAdded?.();
    }
  };

  const handleCSVTransactionsLoaded = (transactions: CSVTransaction[]) => {
    setCsvTransactions(transactions);
  };

  const handleValueChange = (value: string) => {
    const filteredValue = filterInvalidCharacters(value);
    updateFormField('value', filteredValue);
    const validation = validateValue(filteredValue);
    setValueError(validation.error);
  };

  const buttonText = getButtonText(isMobile, inputMode, csvTransactions.length);
  const formIsValid = isFormValid(inputMode, formData, valueError, csvTransactions);

  const pressIn = (v: Animated.Value) => Animated.spring(v, { toValue: 0.98, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.transactionContainer, { opacity: fade }]}>
      <View style={styles.transactionContent}>
        <Text style={styles.title}>Nova transação</Text>

        <ModeSelector currentMode={inputMode} onModeChange={setInputMode} />

        {inputMode === 'manual' ? (
          <ManualTransactionForm
            formData={formData}
            isFocused={isFocused}
            valueError={valueError}
            onFieldChange={updateFormField}
            onValueChange={handleValueChange}
            onFocusChange={setIsFocused}
            onClear={clearForm}
          />
        ) : (
          <>
            <CSVUpload onTransactionsLoaded={handleCSVTransactionsLoaded} />
            <CSVTransactionPreview transactions={csvTransactions} onClear={clearCSV} />
          </>
        )}

        <View style={styles.buttonContainer}>
          {inputMode === 'manual' && (
            <Animated.View style={{ transform: [{ scale: scaleClear }] }}>
              <Pressable
                onPress={clearForm}
                onPressIn={() => pressIn(scaleClear)}
                onPressOut={() => pressOut(scaleClear)}
                disabled={!formData.type && !formData.category && !formData.value}
                style={[
                  styles.clearButton,
                  (!formData.type && !formData.category && !formData.value) && styles.clearButtonDisabled,
                ]}
              >
                <Text style={styles.clearButtonText}>Limpar</Text>
              </Pressable>
            </Animated.View>
          )}
          {inputMode === 'csv' && csvTransactions.length > 0 && (
            <Animated.View style={{ transform: [{ scale: scaleClear }] }}>
              <Pressable
                onPress={clearCSV}
                onPressIn={() => pressIn(scaleClear)}
                onPressOut={() => pressOut(scaleClear)}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Limpar CSV</Text>
              </Pressable>
            </Animated.View>
          )}

          <Animated.View style={{ transform: [{ scale: scaleFinish }] }}>
            <Pressable
              onPress={handleFinishTransaction}
              onPressIn={() => pressIn(scaleFinish)}
              onPressOut={() => pressOut(scaleFinish)}
              disabled={!formIsValid || disabled}
              style={[styles.finishTransaction, (!formIsValid || disabled) && styles.finishTransactionDisabled]}
            >
              <Text style={styles.finishTransactionText}>{buttonText}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <View pointerEvents="none" style={styles.bgDecoration}>
        <TransactionBackground width="100%" height="100%" preserveAspectRatio="xMaxYMax meet" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  transactionContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  transactionContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
    gap: 32,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 30.26,
    textAlign: 'center',
    color: '#DEE9EA',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20, // Espaço extra na parte inferior
    paddingBottom: 10, // Padding adicional para garantir visibilidade
  },
  clearButton: {
    width: 150,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonDisabled: {
    backgroundColor: '#ccc',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  finishTransaction: {
    width: 200,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#004D61',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishTransactionDisabled: {
    backgroundColor: '#ccc',
  },
  finishTransactionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bgDecoration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
