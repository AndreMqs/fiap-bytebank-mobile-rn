import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useTransactionForm } from '../../hooks/useTransactionForm';
import { NewTransactionProps } from '../../types/components';
import { CSVTransaction } from '../../types/transaction';
import {
  createTransactionFromForm,
  createTransactionsFromCSV,
  getButtonText,
  isFormValid,
} from '../../utils/transactionUtils';
import { useValueValidation } from '../../utils/valueValidationUtils';
import CSVUpload from '../CSVUpload/CSVUpload';
import { CSVTransactionPreview } from './CSVTransactionPreview';
import { ManualTransactionForm } from './ManualTransactionForm';
import { ModeSelector } from './ModeSelector';

import TransactionBackground from '../../images/TransactionBackground.svg';

export default function NewTransaction({
  onTransactionAdded,
  className = '',
  disabled = false,
}: NewTransactionProps) {
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
      const transaction = createTransactionFromForm(
        formData.type,
        formData.category,
        formData.value,
        formData.date
      );
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

  const pressIn = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 0.98, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.transactionContainer, { opacity: fade }]}>
      <View pointerEvents="none" style={styles.bgDecoration}>
        <TransactionBackground width="100%" height="100%" preserveAspectRatio="xMaxYMax meet" />
      </View>

      <View style={styles.transactionContent} pointerEvents="auto">
        <View style={styles.contentInner}>
          <Text style={styles.title}>Nova transação</Text>

          <View style={styles.fullWidth}>
            <ModeSelector currentMode={inputMode} onModeChange={setInputMode} />
          </View>

          <View style={styles.fullWidth}>
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
          </View>

          <View style={styles.buttonContainer}>
            {inputMode === 'manual' && (
              <Animated.View style={{ transform: [{ scale: scaleClear }] }}>
                <Pressable
                  onPress={clearForm}
                  onPressIn={() => pressIn(scaleClear)}
                  onPressOut={() => pressOut(scaleClear)}
                  disabled={!formData.type && !formData.category && !formData.value}
                  style={[
                    styles.buttonBase,
                    isMobile ? styles.buttonFlex : styles.clearButtonFixed,
                    (!formData.type && !formData.category && !formData.value)
                      ? styles.clearButtonDisabled
                      : styles.clearButtonBg,
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
                  style={[
                    styles.buttonBase,
                    isMobile ? styles.buttonFlex : styles.clearButtonFixed,
                    styles.clearButtonBg,
                  ]}
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
                style={[
                  styles.buttonBase,
                  isMobile ? styles.buttonFlex : styles.finishButtonFixed,
                  (!formIsValid || disabled) ? styles.finishTransactionDisabled : styles.finishButtonBg,
                ]}
              >
                <Text style={styles.finishTransactionText}>{buttonText}</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
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
    zIndex: 1,
    width: '100%',
    alignItems: 'center',
  },
  contentInner: {
    width: '100%',
    maxWidth: 440,
    gap: 24,
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 30.26,
    color: '#DEE9EA',
    textAlign: 'center',
    alignSelf: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    paddingBottom: 10,
  },
  buttonBase: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFlex: {
    flex: 1,
    minWidth: 120,
  },
  clearButtonFixed: {
    width: 150,
  },
  finishButtonFixed: {
    width: 200,
  },
  clearButtonBg: {
    backgroundColor: '#f44336',
  },
  clearButtonDisabled: {
    backgroundColor: '#ccc',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButtonBg: {
    backgroundColor: '#004D61',
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
    zIndex: 0,
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
});
