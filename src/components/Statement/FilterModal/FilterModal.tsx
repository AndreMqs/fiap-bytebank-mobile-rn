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
    const emptyFilters = { category: '', dateFrom: '', dateTo: '', valueMin: '', valueMax: '', type: '' };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const activeCount = useMemo(() => Object.values(filters).filter((v) => v !== '').length, [filters]);

  const fade = useRef(new Animated.Value(0)).current;
  const scaleBadge = useRef(new Animated.Value(1)).current;

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
            <View style={styles.titleRight}>
              {activeCount > 0 && (
                <Animated.View style={[styles.filterCount, { transform: [{ scale: scaleBadge }] }]}>
                  <Text style={styles.filterCountText}>{activeCount}</Text>
                </Animated.View>
              )}
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
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
                    value={filters.type === 'income' ? 'Receita' : filters.type === 'expense' ? 'Despesa' : ''}
                    placeholder="Todos"
                    options={['Receita', 'Despesa']}
                    onChange={(v) => {
                      const typeValue = v === 'Receita' ? 'income' : v === 'Despesa' ? 'expense' : '';
                      handleFilterChange('type', typeValue);
                    }}
                  />
                </View>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Data Inicial</Text>
                <TextInput
                  value={filters.dateFrom}
                  onChangeText={(t) => handleFilterChange('dateFrom', t)}
                  placeholder="Ex: 2024-01-15"
                  placeholderTextColor="#999"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.label}>Data Final</Text>
                <TextInput
                  value={filters.dateTo}
                  onChangeText={(t) => handleFilterChange('dateTo', t)}
                  placeholder="Ex: 2024-12-31"
                  placeholderTextColor="#999"
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
            <Pressable
              onPress={handleClearFilters}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
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
    borderColor: '#004D61',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#004D61',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
