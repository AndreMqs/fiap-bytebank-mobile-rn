import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CSVUploadProps } from '../../types/components';
import { CSVTransaction } from '../../types/transaction';

export default function CSVUpload({ onTransactionsLoaded }: CSVUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  useEffect(() => {
    if (isLoading) {
      spin.setValue(0);
      Animated.loop(
        Animated.timing(spin, { toValue: 1, duration: 1000, useNativeDriver: true })
      ).start();
    } else {
      spin.stopAnimation();
    }
  }, [isLoading, spin]);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const parseCSV = (csvText: string): CSVTransaction[] => {
    const lines = csvText.split('\n');
    const transactions: CSVTransaction[] = [];
    const dataLines = lines.slice(1);
    for (const rawLine of dataLines) {
      const line = rawLine.replace(/\r$/, '');
      if (line.trim() === '') continue;
      const columns = line.split(',').map((col) => col.trim().replace(/"/g, ''));
      if (columns.length >= 4) {
        const [type, value, category, date] = columns;
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
          throw new Error(`Valor inválido na linha: ${line}`);
        }
        transactions.push({
          type: type.toLowerCase() === 'receita' ? 'income' : 'expense',
          value: parsedValue,
          category: category,
          date: date,
        });
      }
    }
    return transactions;
  };

  const handlePickFile = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'text/plain'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) {
        return;
      }
      const file = result.assets[0];
      if (!file) {
        setError('Nenhum arquivo selecionado.');
        return;
      }
      const isCSV =
        (file.mimeType && file.mimeType.includes('csv')) ||
        (file.name && file.name.toLowerCase().endsWith('.csv'));
      if (!isCSV) {
        setError('Por favor, selecione apenas arquivos CSV.');
        return;
      }
      const text = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const transactions = parseCSV(text);
      if (transactions.length === 0) {
        setError('Nenhuma transação válida encontrada no arquivo CSV.');
        return;
      }
      onTransactionsLoaded(transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.csvUploadContainer, { opacity: fade }]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={({ pressed }) => [
            styles.dropZone,
            pressed && styles.dragOver,
          ]}
          onPress={handlePickFile}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <View style={styles.uploadContent}>
            {isLoading ? (
              <View style={styles.loading}>
                <Animated.View style={[styles.spinner, { transform: [{ rotate: spinInterpolate }] }]} />
                <Text style={styles.loadingText}>Processando arquivo...</Text>
              </View>
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path d="M14 2V8H20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M16 13H8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M16 17H8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M10 9H9H8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <Text style={styles.h3}>Arraste e solte seu arquivo CSV aqui</Text>
                <Text style={styles.p}>ou clique para selecionar</Text>
                <View style={styles.csvInfo}>
                  <Text style={styles.csvInfoP}>Formato esperado: tipo,valor,categoria,data</Text>
                  <Text style={styles.csvInfoP}>Exemplo: Receita,1500.00,Alimentação,2024-01-15</Text>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Animated.View>

      {!!error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  csvUploadContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  dragOver: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
    transform: [{ scale: 1.02 }],
  },
  uploadContent: {
    alignItems: 'center',
    gap: 16,
  },
  h3: {
    margin: 0,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  p: {
    margin: 0,
    color: '#666',
    fontSize: 14,
  },
  uploadIcon: {
    marginBottom: 8,
  },
  csvInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    alignSelf: 'stretch',
  },
  csvInfoP: {
    marginVertical: 4,
    fontSize: 12,
    color: '#555',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'Courier' }),
  },
  loading: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#f3f3f3',
    borderTopColor: '#2196F3',
  },
  error: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 6,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
});
