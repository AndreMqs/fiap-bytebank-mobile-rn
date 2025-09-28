import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FilterCriteria, FilterModalProps } from '../../../types/statement';
import Select from '../../Select/Select';

export default function FilterModal({ open, onClose, onApplyFilters, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    category: '',
    dateFrom: '',
    dateTo: '',
    valueMin: '',
    valueMax: '',
    type: '',
  });

  useEffect(() => {
    if (open) setFilters(currentFilters);
  }, [open, currentFilters]);

  const handleFilterChange = (field: keyof FilterCriteria, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', dateFrom: '', dateTo: '', valueMin: '', valueMax: '', type: '' });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const activeCount = useMemo(() => Object.values(filters).filter((v) => v !== '').length, [filters]);

  const fade = useRef(new Animated.Value(0)).current;
  const scaleBadge = useRef(new Animated.Value(1)).current;
  const scaleApply = useRef(new Animated.Value(1)).current;
  const scaleCancel = useRef(new Animated.Value(1)).current;
  const scaleClear = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (open) {
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    }
  }, [open, fade]);

  useEffect(() => {
    if (activeCount > 0) {
      Animated.sequence([
        Animated.spring(scaleBadge, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(scaleBadge, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [activeCount, scaleBadge]);

  const pressIn = (v: Animated.Value) => Animated.spring(v, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  if (!open) return null;

  const { width } = Dimensions.get('window');
  const isNarrow = width <= 600;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalOverlay, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.modalContainer, { width: width * 0.9, maxWidth: 500 }]}>
          <View style={styles.modalTitle}>
            <Text style={styles.modalTitleText}>Filtros</Text>
            {activeCount > 0 && (
              <Animated.View style={[styles.filterCount, { transform: [{ scale: scaleBadge }] }]}>
                <Text style={styles.filterCountText}>{activeCount}</Text>
              </Animated.View>
            )}
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 16 }}>
            <View style={[styles.filterGrid, isNarrow && styles.filterGridNarrow]}>
              <View style={styles.filterField}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.inputWrapper}>
                  <Select
                    value={filters.category}
                    placeholder="Todas"
                    options={['Alimentação', 'Moradia', 'Saúde', 'Estudo', 'Transporte']}
                    onChange={(v) => handleFilterChange('category', v)}
                  />
                </View>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.inputWrapper}>
                  <Select
                    value={filters.type}
                    placeholder="Todos"
                    options={['income', 'expense']}
                    onChange={(v) => handleFilterChange('type', v)}
                  />
                </View>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Data Inicial</Text>
                <TextInput
                  value={filters.dateFrom}
                  onChangeText={(t) => handleFilterChange('dateFrom', t)}
                  placeholder="YYYY-MM-DD"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Data Final</Text>
                <TextInput
                  value={filters.dateTo}
                  onChangeText={(t) => handleFilterChange('dateTo', t)}
                  placeholder="YYYY-MM-DD"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Valor Mínimo</Text>
                <TextInput
                  value={filters.valueMin}
                  onChangeText={(t) => handleFilterChange('valueMin', t)}
                  keyboardType="decimal-pad"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Valor Máximo</Text>
                <TextInput
                  value={filters.valueMax}
                  onChangeText={(t) => handleFilterChange('valueMax', t)}
                  keyboardType="decimal-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Animated.View style={{ transform: [{ scale: scaleClear }] }}>
              <Pressable
                onPress={handleClearFilters}
                onPressIn={() => pressIn(scaleClear)}
                onPressOut={() => pressOut(scaleClear)}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Limpar Filtros</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleCancel }] }}>
              <Pressable
                onPress={onClose}
                onPressIn={() => pressIn(scaleCancel)}
                onPressOut={() => pressOut(scaleCancel)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleApply }] }}>
              <Pressable
                onPress={handleApply}
                onPressIn={() => pressIn(scaleApply)}
                onPressOut={() => pressOut(scaleApply)}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2F2E41',
  },
  filterCount: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  filterGridNarrow: {
    flexDirection: 'column',
    gap: 16,
  },
  filterField: {
    flexBasis: '48%',
    maxWidth: '48%',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  inputWrapper: {
    height: 48,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  modalActions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
