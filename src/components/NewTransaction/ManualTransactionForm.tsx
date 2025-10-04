import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { ManualTransactionFormProps } from '../../types/components';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../utils/constants';
import { parseMoneyValue } from '../../utils/stringUtils';
import Select from '../Select/Select';

export const ManualTransactionForm = ({
  formData,
  isFocused,
  valueError,
  onFieldChange,
  onValueChange,
  onFocusChange,
}: ManualTransactionFormProps) => {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const inputValue = useMemo(() => {
    if (isFocused) return formData.value;
    const value = parseFloat(formData.value.replace(',', '.'));
    if (Number.isNaN(value) || value <= 0) return parseMoneyValue(0);
    return parseMoneyValue(value);
  }, [formData.value, isFocused]);

  return (
    <Animated.View style={[styles.form, { opacity: fade }]}>
      {/* Tipo */}
      <View style={styles.fieldContainer}>
        <Select
          value={formData.type}
          placeholder="Selecione o tipo de transação"
          options={TRANSACTION_TYPES}
          onChange={(value) => onFieldChange('type', value)}
        />
      </View>

      {/* Categoria */}
      <View style={styles.fieldContainer}>
        <Select
          value={formData.category}
          placeholder="Selecione a categoria"
          options={TRANSACTION_CATEGORIES}
          onChange={(value) => onFieldChange('category', value)}
        />
      </View>

      {/* Data */}
      <View style={styles.fieldContainer}>
        <Text style={styles.inputLabel}>Data</Text>
        <TextInput
          value={formData.date}
          onChangeText={(text) => onFieldChange('date', text)}
          placeholder="YYYY-MM-DD"
          style={styles.inputValue}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
      </View>

      {/* Valor */}
      <View style={styles.fieldContainer}>
        <Text style={styles.inputLabel}>Valor</Text>
        <TextInput
          value={inputValue}
          onChangeText={(text) => onValueChange(text)}
          keyboardType="decimal-pad"
          style={[styles.inputValue, valueError ? styles.inputError : undefined]}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
        {!!valueError && <Text style={styles.errorText}>{valueError}</Text>}
      </View>
    </Animated.View>
  );
};

const FIELD_MAX_WIDTH = 360; // ajuste se quiser mais largo/estreito

const styles = StyleSheet.create({
  // Contêiner do formulário centralizado
  form: {
    width: '100%',
    alignItems: 'center', // centraliza horizontalmente os filhos
    gap: 16,
  },

  // Cada “linha” (Select/Input) ocupa toda a largura disponível do miolo,
  // mas limita pelo maxWidth para manter a estética
  fieldContainer: {
    width: '100%',
    maxWidth: FIELD_MAX_WIDTH,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19.36,
    textAlign: 'left',
    color: '#DEE9EA',
    marginBottom: 12,
  },

  inputValue: {
    borderWidth: 1,
    borderColor: '#004D61',
    backgroundColor: '#fff',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.36,
    textAlign: 'center',
    borderRadius: 8,
    height: 48,
    width: '100%',
    paddingHorizontal: 12,
  },

  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },

  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
