import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import Edit from '../../images/Edit.svg';
import Filter from '../../images/Filter.svg';
import { FilterCriteria, StatementProps } from '../../types/statement';
import { filterTransactions, getActiveFiltersCount } from '../../utils/filterUtils';
import { getStatementByMonth } from '../../utils/statementUtils';
import FilterModal from './FilterModal/FilterModal';
import StatementList from './StatementList/StatementList';

export default function Statement(props: StatementProps) {
  const { transactions, deleteTransaction } = props;

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
    setDisplayedTransactions([]);
    setHasMore(filteredTransactions.length > 0);
  }, [activeFilters, filteredTransactions.length]);

  useEffect(() => {
    const initialItems = filteredTransactions.slice(0, 5);
    setDisplayedTransactions(initialItems);
    const newHasMore = filteredTransactions.length > 5;
    setHasMore(newHasMore);
  }, [filteredTransactions.length]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
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
        <Text style={styles.headerTitle}>Extrato</Text>
        <View style={styles.headerButtonsContainer}>
          <Animated.View style={{ transform: [{ scale: scaleEdit }] }}>
            <Pressable
              onPress={() => setIsEditing(!isEditing)}
              onPressIn={() => pressIn(scaleEdit)}
              onPressOut={() => pressOut(scaleEdit)}
              style={styles.headerButton}
            >
              <Edit width={22} height={22} />
            </Pressable>
          </Animated.View>

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
                <Filter width={22} height={22} />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>

      <View style={styles.statementsListContainer}>
        <StatementList
          statementsByMonth={getStatementByMonth(displayedTransactions)}
          isEditing={isEditing}
          deleteTransaction={deleteTransaction}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
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
    width: 282,
    height: 600,
    backgroundColor: '#F5F5F5',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    maxWidth: 240,
    width: '100%',
  },
  headerTitle: {
    fontSize: 25,
    color: '#000000',
    fontWeight: '700',
    lineHeight: 30.26,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#004D61',
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: 240,
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
});
