import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import Edit from '../../images/Edit.svg';
import Filter from '../../images/Filter.svg';
import { FilterCriteria, StatementProps } from '../../types/statement';
import { filterTransactions, getActiveFiltersCount } from '../../utils/filterUtils';
import { getStatementByMonth } from '../../utils/statementUtils';
import EmptyState from './EmptyState/EmptyState';
import FilterModal from './FilterModal/FilterModal';
import StatementList from './StatementList/StatementList';

export default function Statement(props: StatementProps) {
  const { transactions, deleteTransaction, updateTransaction, userId } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    category: '',
    dateFrom: '',
    dateTo: '',
    valueMin: '',
    valueMax: '',
    type: '',
  });
  const [displayedTransactions, setDisplayedTransactions] = useState<typeof transactions>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const INITIAL_ITEMS = 4;
  const ITEMS_PER_PAGE = 1;

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, activeFilters),
    [transactions, activeFilters]
  );
  const activeFiltersCount = useMemo(
    () => getActiveFiltersCount(activeFilters),
    [activeFilters]
  );

  useEffect(() => {
    // Reset displayed transactions when filters change
    setDisplayedTransactions([]);
    setHasMore(filteredTransactions.length > 0);
    
    // Load initial items (4 transações)
    const initialItems = filteredTransactions.slice(0, INITIAL_ITEMS);
    setDisplayedTransactions(initialItems);
    const newHasMore = filteredTransactions.length > INITIAL_ITEMS;
    setHasMore(newHasMore);
  }, [filteredTransactions]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) {
      return;
    }
    
    setIsLoading(true);
    
    // Simular delay de carregamento
    await new Promise((r) => setTimeout(r, 300));
    
    const currentLength = displayedTransactions.length;
    const newItems = filteredTransactions.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    
    setDisplayedTransactions((prev) => [...prev, ...newItems]);
    
    const nextLength = currentLength + ITEMS_PER_PAGE;
    const newHasMore = nextLength < filteredTransactions.length;
    setHasMore(newHasMore);
    setIsLoading(false);
  };

  const handleApplyFilters = (filters: FilterCriteria) => {
    setActiveFilters(filters);
  };

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const fade = useRef(new Animated.Value(0)).current;
  const scaleEdit = useRef(new Animated.Value(1)).current;
  const scaleFilter = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    if (activeFiltersCount > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [activeFiltersCount, badgeScale]);

  const pressIn = (v: Animated.Value) => Animated.spring(v, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.statementContainer, { opacity: fade }]}>
      <View style={styles.statementHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Extrato</Text>
          {isEditing && (
            <View style={styles.editingIndicator}>
              <Text style={styles.editingText}>Modo Edição</Text>
            </View>
          )}
          
          <View style={styles.headerButtonsContainer}>
            <Animated.View style={{ transform: [{ scale: scaleEdit }] }}>
              <Pressable
                onPress={() => setIsEditing(!isEditing)}
                onPressIn={() => pressIn(scaleEdit)}
                onPressOut={() => pressOut(scaleEdit)}
                style={[styles.headerButton, isEditing && styles.headerButtonActive]}
              >
                <Edit width={20} height={20} />
              </Pressable>
            </Animated.View>
            
            {isEditing && (
              <Pressable
                onPress={() => setIsEditing(false)}
                style={styles.finishButton}
              >
                <Text style={styles.finishButtonText}>Concluir</Text>
              </Pressable>
            )}

            <View style={styles.badgeWrapper}>
              {activeFiltersCount > 0 && (
                <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }] }]}>
                  <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                </Animated.View>
              )}
              <Animated.View style={{ transform: [{ scale: scaleFilter }] }}>
                <Pressable
                  onPress={handleOpenFilterModal}
                  onPressIn={() => pressIn(scaleFilter)}
                  onPressOut={() => pressOut(scaleFilter)}
                  style={styles.headerButton}
                >
                  <Filter width={20} height={20} />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statementsListContainer}>
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="Nenhuma transação encontrada"
            subtitle={activeFiltersCount > 0 
              ? "Nenhuma transação corresponde aos filtros aplicados. Tente ajustar os critérios de busca ou limpar os filtros."
              : "Seu extrato está vazio. Comece adicionando suas primeiras transações para acompanhar suas movimentações financeiras."
            }
            icon="🔍"
          />
        ) : (
          <StatementList
            statementsByMonth={getStatementByMonth(displayedTransactions)}
            isEditing={isEditing}
            deleteTransaction={deleteTransaction}
            updateTransaction={updateTransaction}
            userId={userId}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        )}
      </View>

      <FilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statementContainer: {
    width: '100%',
    maxWidth: 450,
    minHeight: 500,
    backgroundColor: '#F5F5F5',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 25,
    color: '#000000',
    fontWeight: '700',
    lineHeight: 30.26,
  },
  editingIndicator: {
    backgroundColor: '#47A138',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  editingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    flexShrink: 0,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#004D61',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonActive: {
    backgroundColor: '#47A138',
  },
  finishButton: {
    backgroundColor: '#47A138',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  badgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF5031',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statementsListContainer: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
});
