import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { StatementListProps } from '../../../types/statement';
import SingleStatement from '../SingleStatement/SingleStatement';

export default function StatementList(props: StatementListProps) {
  const { statementsByMonth, isEditing, deleteTransaction, updateTransaction, userId, onLoadMore, hasMore = false, isLoading = false } = props;

  const fade = useRef(new Animated.Value(0)).current;
  const spinnerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    if (isLoading) {
      Animated.sequence([
        Animated.spring(spinnerScale, { toValue: 1.1, useNativeDriver: true }),
        Animated.spring(spinnerScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoading, spinnerScale]);

  const months = useMemo(() => Array.from(statementsByMonth.keys()), [statementsByMonth]);

  const capitalizeLocal = useCallback((s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s), []);

  const flatListData = useMemo(() => {
    const items: Array<{ type: 'month' | 'transaction'; data: any; month?: string; index?: number }> = [];
    
    months.forEach((month) => {
      items.push({ type: 'month', data: month, month });
      const transactions = statementsByMonth.get(month) || [];
      transactions.forEach((transaction, index) => {
        items.push({ type: 'transaction', data: transaction, month, index });
      });
    });
    
    return items;
  }, [statementsByMonth, months]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (item.type === 'month') {
      return <Text style={styles.month}>{capitalizeLocal(item.data)}</Text>;
    }
    
    return (
      <SingleStatement
        transaction={item.data}
        isEditing={isEditing}
        deleteTransaction={deleteTransaction}
        updateTransaction={updateTransaction}
        userId={userId}
        key={`${item.month}-${item.data.id}-${item.index}`}
      />
    );
  }, [isEditing, deleteTransaction, updateTransaction, userId, capitalizeLocal]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  const renderFooter = useCallback(() => {
    if (isLoading) {
      return (
        <Animated.View style={[styles.loadingContainer, { transform: [{ scale: spinnerScale }] }]}>
          <ActivityIndicator size="small" color="#47A138" />
        </Animated.View>
      );
    }
    
    if (hasMore) {
      return <View style={{ height: 20 }} />;
    }
    
    return null;
  }, [isLoading, hasMore, spinnerScale]);

  return (
    <Animated.View style={[styles.statementListWrapper, { opacity: fade }]}>
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}-${item.data.id || item.data}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ paddingRight: 8 }}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  month: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 15.73,
    textAlign: 'left',
    color: '#47A138',
    marginBottom: 8,
    marginTop: 8,
  },
  statementListWrapper: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 60,
    marginTop: 16,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
