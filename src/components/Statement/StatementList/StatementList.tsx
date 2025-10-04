import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatementListProps } from '../../../types/statement';
import SingleStatement from '../SingleStatement/SingleStatement';

export default function StatementList(props: StatementListProps) {
  const { statementsByMonth, isEditing, deleteTransaction, updateTransaction, userId, onLoadMore, hasMore = false, isLoading = false } = props;

  const fade = useRef(new Animated.Value(0)).current;
  const spinnerScale = useRef(new Animated.Value(1)).current;
  const threshold = 50;

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

  const canLoadRef = useRef(true);
  useEffect(() => {
    canLoadRef.current = true;
  }, [isLoading]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    if (distanceFromBottom < threshold && hasMore && !isLoading && canLoadRef.current) {
      canLoadRef.current = false;
      onLoadMore && onLoadMore();
    }
  };

  return (
    <Animated.View style={[styles.statementListWrapper, { opacity: fade }]}>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingRight: 8 }}>
        {months.map((month) => (
          <View key={month}>
            <Text style={styles.month}>{capitalizeLocal(month)}</Text>
            <View style={styles.listContainer}>
              {statementsByMonth.get(month)?.map((statement, index) => (
                <SingleStatement
                  transaction={statement}
                  isEditing={isEditing}
                  deleteTransaction={deleteTransaction}
                  updateTransaction={updateTransaction}
                  userId={userId}
                  key={`${month}-${statement.id}-${index}`}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.loadingContainer}>
          {isLoading ? (
            <Animated.View style={{ transform: [{ scale: spinnerScale }] }}>
              <ActivityIndicator size="small" color="#47A138" />
            </Animated.View>
          ) : hasMore ? (
            <View style={{ height: 20 }} />
          ) : null}
        </View>
      </ScrollView>
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
  },
  listContainer: {
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
